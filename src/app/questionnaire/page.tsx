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
  const [followUps, setFollowUps] = useState<Record<string, string>>({});
  const [loadingFollowUp, setLoadingFollowUp] = useState<string | null>(null);
  const [rephraseIds, setRephraseIds] = useState<Record<string, string>>({});
  const [doubleNeutrals, setDoubleNeutrals] = useState<string[]>([]);

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

  // Handle original question answers
  const handleOriginalAnswer = useCallback(
    async (id: string, value: number) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));

      // If NEUTRAL, trigger rephrase and DO NOT advance
      if (value === 4) {
        const questionText = questions.find((q) => q.id === id)?.text || "";
        setLoadingFollowUp(id);
        console.log("Rephrasing for question:", { id, questionText });

        try {
          const { rephrasedPrompt, id: rephraseId } = await rephraseQuestion({
            questionId: id,
            questionText,
            answer: value,
          });
          console.log("Got rephrased prompt:", rephrasedPrompt);
          setFollowUps((prev) => ({ ...prev, [id]: rephrasedPrompt }));
          setRephraseIds((prev) => ({ ...prev, [id]: rephraseId }));
        } catch (err) {
          console.error("Question rephrasing failed:", err);
        } finally {
          setLoadingFollowUp(null);
        }
        // DO NOT advance index for neutral responses
        return;
      }

      // For non-neutral answers, advance as normal
      const idx = questions.findIndex((q) => q.id === id);
      if (idx === currentIndex && currentIndex < total - 1) {
        setCurrentIndex(idx + 1);
      }
    },
    [currentIndex, questions, rephraseQuestion, total]
  );

  // Handle follow-up question answers
  const handleFollowUpAnswer = useCallback(
    async (id: string, value: number) => {
      const originalId = id.replace("_followup", "");
      const rephraseId = rephraseIds[originalId];
      setAnswers((prev) => ({ ...prev, [id]: value }));

      // Track double-neutral responses
      const isDoubleNeutral = value === 4;
      if (isDoubleNeutral) {
        setDoubleNeutrals((prev) => [...prev, originalId]);
      }
      
      // PATCH answer to DB
      if (rephraseId) {
        try {
          await fetch('/api/agent', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: rephraseId, 
              followUpAnswer: String(value),
              isDoubleNeutral 
            }),
          });
        } catch (err) {
          console.error("Failed to save follow-up answer:", err);
        }
      }

      // Always advance after a follow-up is answered
      const idx = questions.findIndex((q) => q.id === originalId);
      if (idx === currentIndex && currentIndex < total - 1) {
        setCurrentIndex(idx + 1);
      }
    },
    [currentIndex, questions, rephraseIds, total]
  );

  // Main answer change handler
  const handleAnswerChange = useCallback(
    (id: string, value: number) => {
      if (id.endsWith("_followup")) {
        handleFollowUpAnswer(id, value);
      } else {
        handleOriginalAnswer(id, value);
      }
    },
    [handleFollowUpAnswer, handleOriginalAnswer]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Count only answers to original questions (not follow-ups) for completion check
      const originalQuestionsAnswered = Object.keys(answers).filter(id => !id.includes('_followup')).length;
      
      if (originalQuestionsAnswered !== total) {
        setFormError(`Please answer all questions before submitting. (${originalQuestionsAnswered}/${total})`);
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

  // Debugging logs for follow-ups
  useEffect(() => {
    if (Object.keys(followUps).length > 0) {
      console.log("Current followUps state:", followUps);
    }
  }, [followUps]);

  useEffect(() => {
    if (loadingFollowUp) {
      console.log("Loading follow-up for:", loadingFollowUp);
    }
  }, [loadingFollowUp]);

  const visible = questions.slice(0, currentIndex + 1);
  
  // Count only answers to original questions, not follow-ups
  const originalAnswersCount = Object.keys(answers).filter(id => !id.includes('_followup')).length;
  const allAnswered = originalAnswersCount === total;

  // Debug what's visible 
  useEffect(() => {
    console.log("Current visible questions:", visible.map(q => q.id));
    console.log("Current index:", currentIndex);
  }, [visible, currentIndex]);

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
            const isFollowUpLoading = loadingFollowUp === q.id;
            const followUp = followUps[q.id];

            return (
              <motion.div
                key={q.id}
                initial={{ y: isActive ? -10 : 0, opacity: isActive ? 1 : 0.6 }}
                animate={{ y: 0, opacity: isActive ? 1 : 0.5 }}
                exit={{ y: 10, opacity: 0 }}
                transition={ANIM}
                className={isActive ? "mb-8" : "mb-4"}
              >
                {/* Show loading or follow-up ABOVE the original question */}
                {isActive && (
                  <>
                    {isFollowUpLoading && (
                      <p className="text-sm text-gray-500 animate-pulse pl-4 mb-2">🧠 Generating follow-up...</p>
                    )}
                    {followUp && (
                      <Question
                        id={`${q.id}_followup`}
                        text={followUp}
                        value={answers[`${q.id}_followup`] ?? 0}
                        onChange={handleAnswerChange}
                      />
                    )}
                  </>
                )}

                {/* Original Question (outlined/disabled if follow-up exists) */}
                <Question
                  id={q.id}
                  text={q.text}
                  value={answers[q.id] ?? 0}
                  onChange={handleAnswerChange}
                  disabled={!!followUp}
                  outlined={!!followUp}
                />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </form>
  );
}
