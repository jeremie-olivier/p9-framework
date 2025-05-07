import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { callClaude } from '@/lib/brain';
import { z } from 'zod';

const Body = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  questionId: z.string(),
  questionText: z.string(),
  answer: z.number(),
});

// PATCH body schema for updating followUpAnswer and future AgentKit fields
const PatchBody = z.object({
  id: z.string(),
  followUpAnswer: z.string(),
  agentKitData: z.any().optional(), // for future use
});

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, questionId, questionText, answer } = Body.parse(await req.json());

    const prompt = `The user gave a neutral answer (score ${answer}) to this introspective personality question: "${questionText}". Rephrase it more personally or in a deeper way to encourage reflection.`;

    const rephrasedPrompt = await callClaude(prompt);

    // Log in DB
    const record = await prisma.questionRephrase.create({
      data: {
        userId: userId || undefined,
        sessionId: sessionId || undefined,
        questionId,
        originalQuestion: questionText,
        originalAnswer: answer,
        rephrasedPrompt,
      },
    });

    return NextResponse.json({ rephrasedPrompt, id: record.id });
  } catch (error) {
    console.error('Question rephrasing error:', error);
    return NextResponse.json(
      { error: 'Failed to process rephrasing request' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, followUpAnswer, agentKitData } = PatchBody.parse(await req.json());
    const updateData: any = { followUpAnswer };
    if (agentKitData !== undefined) updateData.agentKitData = agentKitData;

    const updated = await prisma.questionRephrase.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Failed to update followUpAnswer:', error);
    return NextResponse.json(
      { error: 'Failed to update followUpAnswer' },
      { status: 500 }
    );
  }
}
