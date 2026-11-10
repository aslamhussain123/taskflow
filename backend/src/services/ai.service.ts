// src/services/ai.service.ts
import OpenAI from 'openai';
import { z } from 'zod';

export const GeneratedTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().nullable(),
});

export type GeneratedTask = z.infer<typeof GeneratedTaskSchema>;

export const generateTaskFromPrompt = async (prompt: string): Promise<GeneratedTask> => {
  debugger
  // Initialize client HERE so dotenv has already loaded the key
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: `You are an AI task assistant. The current date is ${new Date().toISOString().slice(0, 10)}. Convert the user's natural language input into a structured task. Return dueDate as a valid ISO 8601 date-time string, or null when no due date is specified.`,
      },
      { role: 'user', content: prompt },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'task_generation',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            dueDate: { type: ['string', 'null'] },
          },
          required: ['title', 'description', 'priority', 'dueDate'],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('No content returned from AI');

  return GeneratedTaskSchema.parse(JSON.parse(content));
};
