'use server';

/**
 * @fileOverview Answers general questions about hackathons.
 *
 * - generalHackathonQuery - Answers a user's query.
 * - GeneralHackathonQueryInput - Input for the flow.
 * - GeneralHackathonQueryOutput - Output for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneralHackathonQueryInputSchema = z.object({
  query: z.string().describe('The user\'s question about hackathons.'),
});

export type GeneralHackathonQueryInput = z.infer<typeof GeneralHackathonQueryInputSchema>;

const GeneralHackathonQueryOutputSchema = z.object({
    answer: z.string().describe('The answer to the user\'s question.'),
});

export type GeneralHackathonQueryOutput = z.infer<typeof GeneralHackathonQueryOutputSchema>;

export async function generalHackathonQuery(
  input: GeneralHackathonQueryInput
): Promise<GeneralHackathonQueryOutput> {
  return generalHackathonQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalHackathonQueryPrompt',
  input: { schema: GeneralHackathonQueryInputSchema },
  output: { schema: GeneralHackathonQueryOutputSchema },
  prompt: `You are an expert hackathon mentor and AI assistant. Your goal is to answer the user's question about hackathons in a helpful and concise way.

User's Question:
"{{{query}}}"

Provide a clear and helpful answer.
`,
});

const generalHackathonQueryFlow = ai.defineFlow(
  {
    name: 'generalHackathonQueryFlow',
    inputSchema: GeneralHackathonQueryInputSchema,
    outputSchema: GeneralHackathonQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
