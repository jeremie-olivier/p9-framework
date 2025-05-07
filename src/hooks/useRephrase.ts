import { useMutation } from '@tanstack/react-query';

export function useRephrase() {
  return useMutation({
    mutationFn: async ({
      userId,
      sessionId,
      questionId,
      questionText,
      answer,
    }: {
      userId?: string;
      sessionId?: string;
      questionId: string;
      questionText: string;
      answer: number;
    }) => {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sessionId, questionId, questionText, answer }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to rephrase question');
      }
      
      return res.json(); // { rephrasedPrompt }
    },
  });
}
