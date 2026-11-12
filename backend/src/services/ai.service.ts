// // src/services/ai.service.ts
// import OpenAI from 'openai';
// import { z } from 'zod';

// export const GeneratedTaskSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
//   dueDate: z.string().nullable(),
// });

// export type GeneratedTask = z.infer<typeof GeneratedTaskSchema>;

// export const generateTaskFromPrompt = async (prompt: string): Promise<GeneratedTask> => {
//   // Initialize client HERE so dotenv has already loaded the key
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

//   const response = await openai.chat.completions.create({
//     model,
//     messages: [
//       {
//         role: 'system',
//         content: `You are an AI task assistant. The current date is ${new Date().toISOString().slice(0, 10)}. Convert the user's natural language input into a structured task. Return dueDate as a valid ISO 8601 date-time string, or null when no due date is specified.`,
//       },
//       { role: 'user', content: prompt },
//     ],
//     response_format: {
//       type: 'json_schema',
//       json_schema: {
//         name: 'task_generation',
//         strict: true,
//         schema: {
//           type: 'object',
//           properties: {
//             title: { type: 'string' },
//             description: { type: 'string' },
//             priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
//             dueDate: { type: ['string', 'null'] },
//           },
//           required: ['title', 'description', 'priority', 'dueDate'],
//           additionalProperties: false,
//         },
//       },
//     },
//   });

//   const content = response.choices[0].message.content;
//   if (!content) throw new Error('No content returned from AI');

//   return GeneratedTaskSchema.parse(JSON.parse(content));
// };


import OpenAI from 'openai';
import { z } from 'zod';

export const GeneratedTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  priority: z
    .preprocess(
      (v) => (typeof v === 'string' ? v.toUpperCase() : v),
      z.enum(['LOW', 'MEDIUM', 'HIGH'])
    )
    .default('MEDIUM'),
  dueDate: z.string().nullable().default(null),
});

export type GeneratedTask = z.infer<typeof GeneratedTaskSchema>;

// Create the client lazily so env vars are read at call time,
// not at import time (before dotenv/config may have run).
let client: OpenAI | null = null;
const getClient = () => {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error('OLLAMA_API_KEY is not set in the container');
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.OLLAMA_BASE_URL || 'https://ollama.com/v1',
      apiKey,
    });
  }
  return client;
};

const extractJson = (raw: string) => {
  // strip ```json fences if the model adds them
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

export const generateTaskFromPrompt = async (
  prompt: string
): Promise<GeneratedTask> => {
  const model = process.env.OLLAMA_MODEL;
  if (!model) throw new Error('OLLAMA_MODEL is not set in the container');

  let content: string | null | undefined;
  try {
    const response = await getClient().chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an AI task assistant.
Current date: ${new Date().toISOString().slice(0, 10)}.

Convert the user's input into a structured task.
If the input is unclear, still return a task with a best-guess title.

Return JSON with exactly these keys:
- title (string)
- description (string)
- priority ("LOW" | "MEDIUM" | "HIGH")
- dueDate (ISO 8601 string or null)

Return only valid JSON.`,
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });
    content = response.choices[0]?.message?.content;
  } catch (err: any) {
    console.error('[AI] upstream error:', {
      status: err?.status,
      message: err?.message,
      body: err?.error,
      model,
    });
    throw err;
  }

  if (!content) throw new Error('No content returned from model');

  try {
    return GeneratedTaskSchema.parse(extractJson(content));
  } catch (err) {
    console.error('[AI] parse/validation failed. Raw output:', content, err);
    throw err;
  }
}