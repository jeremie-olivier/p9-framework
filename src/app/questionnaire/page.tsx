"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { track } from "@vercel/analytics";
import Question from "./components/Question";
import { questions } from "./components/questions";
import { useRephrase } from "@/hooks/useRephrase";

const ANIM = { duration: 0.3 };
const STORAGE_ANS = "p9_answers";
const STORAGE_IDX = "p9_currentIndex";
const STORAGE_TEST = "p9_testId";

export default function Questionnaire() {
  const router = useRouter();
  const total = questions.length;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: rephraseQuestion } = useRephrase();

  // Hydrate once on mount (fire-and-forget)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const a = sessionStorage.getItem(STORAGE_ANS);
      if (a) setAnswers(JSON.parse(a));
      const idx = parseInt(sessionStorage.getItem(STORAGE_IDX) || "", 10);
      if (!isNaN(idx) && idx >= 0 && idx < total) {
        setCurrentIndex(idx);
      }
    } catch { }
  }, [total]);

  // Persist answers & index continuously
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_ANS, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_IDX, String(currentIndex));
  }, [currentIndex]);

  // advances index when the user answers current question
  const handleAnswerChange = useCallback(
    async (id: string, value: number) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));

      // NEUTRAL score (4) triggers question rephrasing
      if (value === 4) {
        const questionText = questions.find((q) => q.id === id)?.text || "";
        console.log('Triggering rephrasing for:', { id, questionText, value });
        
        try {
          const { rephrasedPrompt, id: rephraseId } = await rephraseQuestion({
            questionId: id,
            questionText,
            answer: value,
          });
          console.log('Got rephrased prompt:', rephrasedPrompt);
          console.log('rephraseId:', rephraseId);

          // Show follow-up prompt in a modal or inline UI
          const followUp = window.prompt(`🧠 Follow-up: ${rephrasedPrompt}`, "");
          if (followUp && rephraseId) {
            try {
              const patchRes = await fetch('/api/agent', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: rephraseId, followUpAnswer: followUp }),
              });
              if (!patchRes.ok) {
                const err = await patchRes.json();
                console.error('PATCH error:', err);
              } else {
                console.log("Follow-up answer saved!");
              }
            } catch (err) {
              console.error("Failed to save follow-up answer:", err);
            }
          } else {
            console.warn('No followUp or rephraseId, PATCH not sent');
          }
        } catch (err) {
          console.error("Question rephrasing failed:", err);
          // Show error to user
          window.alert("Sorry, I couldn't rephrase the question. Please try again.");
        }
      }

      const idx = questions.findIndex((q) => q.id === id);
      if (idx === currentIndex && currentIndex < total - 1) {
        setCurrentIndex(idx + 1);
      }
    },
    [currentIndex, total, rephraseQuestion]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (Object.keys(answers).length !== total) {
        setFormError("Please answer all questions before submitting.");
        return;
      }
      setFormError(null);
      setIsSubmitting(true);

      try {
        // generate or reuse testId
        let testId = sessionStorage.getItem(STORAGE_TEST);
        if (!testId) {
          testId = nanoid();
          sessionStorage.setItem(STORAGE_TEST, testId);
        }

        // analytics (fire-and-forget)
        try { track("Completed Questionnaire"); } catch { }

        // Navigate to results (answers/testId still in sessionStorage)
        router.push("/results");
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, router, total]
  );

  const visible = questions.slice(0, currentIndex + 1);
  const allAnswered = Object.keys(answers).length === total;

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Personality Assessment</h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600" aria-live="polite">
          Question {currentIndex + 1} of {total}
        </p>
        <button
          type="submit"
          disabled={!allAnswered || isSubmitting}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-600 transition-opacity"
        >
          {isSubmitting ? "Submitting..." : "Submit Answers"}
        </button>
      </div>

      {formError && (
        <p className="mb-4 text-red-600" role="alert">
          {formError}
        </p>
      )}

      <AnimatePresence initial={false}>
        {visible
          .slice()
          .reverse()
          .map((q, revIdx) => {
            const idx = visible.length - 1 - revIdx;
            const isActive = idx === currentIndex;
            return (
              <motion.div
                key={q.id}
                initial={{ y: isActive ? -10 : 0, opacity: isActive ? 1 : 0.6 }}
                animate={{ y: 0, opacity: isActive ? 1 : 0.5 }}
                exit={{ y: 10, opacity: 0 }}
                transition={ANIM}
                className={isActive ? "mb-8" : "mb-4"}
              >
                <Question
                  id={q.id}
                  text={q.text}
                  value={answers[q.id] ?? 0}
                  onChange={handleAnswerChange}
                />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </form>
  );
}
