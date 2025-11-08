
'use server';
/**
 * @fileOverview Suggests hackathon problem statements based on a given domain.
 *
 * - suggestProblemStatements - Suggests problem statements.
 * - SuggestProblemStatementsInput - Input for the flow.
 * - SuggestProblemStatementsOutput - Output for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestProblemStatementsInputSchema = z.object({
  domain: z.string().describe('The domain or area of interest (e.g., healthcare, finance).'),
});

export type SuggestProblemStatementsInput = z.infer<typeof SuggestProblemStatementsInputSchema>;

const ProblemStatementSchema = z.object({
    statement: z.string().describe('The hackathon problem statement.'),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The estimated difficulty level.'),
});

const SuggestProblemStatementsOutputSchema = z.array(ProblemStatementSchema);

export type SuggestProblemStatementsOutput = z.infer<typeof SuggestProblemStatementsOutputSchema>;

export async function suggestProblemStatements(
  input: SuggestProblemStatementsInput
): Promise<SuggestProblemStatementsOutput> {
  return suggestProblemStatementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProblemStatementsPrompt',
  input: { schema: SuggestProblemStatementsInputSchema },
  output: { schema: SuggestProblemStatementsOutputSchema },
  prompt: `You are an AI assistant that helps users brainstorm ideas for hackathons.

Generate a list of 3 diverse and interesting problem statements for the following domain: "{{{domain}}}".

For each problem statement, provide a difficulty level (Beginner, Intermediate, or Advanced).

Your response must be a JSON array of objects, where each object contains a "statement" and a "difficulty".
`,
});

const suggestProblemStatementsFlow = ai.defineFlow(
  {
    name: 'suggestProblemStatementsFlow',
    inputSchema: SuggestProblemStatementsInputSchema,
    outputSchema: SuggestProblemStatementsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
