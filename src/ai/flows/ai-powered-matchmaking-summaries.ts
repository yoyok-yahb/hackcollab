'use server';
/**
 * @fileOverview AI-powered matchmaking summaries flow.
 *
 * - generateMatchSummary - A function that generates a personalized summary for a potential teammate.
 * - GenerateMatchSummaryInput - The input type for the generateMatchSummary function.
 * - GenerateMatchSummaryOutput - The return type for the generateMatchSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMatchSummaryInputSchema = z.object({
  userProfile: z.string().describe('The user profile information.'),
  teamOpeningRequirements: z.string().describe('The team opening requirements.'),
});
export type GenerateMatchSummaryInput = z.infer<typeof GenerateMatchSummaryInputSchema>;

const GenerateMatchSummaryOutputSchema = z.object({
  summary: z.string().describe('A personalized summary of the potential teammate and why they are a good match.'),
  rank: z.number().describe('A numerical rank indicating the suitability of the match.'),
});
export type GenerateMatchSummaryOutput = z.infer<typeof GenerateMatchSummaryOutputSchema>;

export async function generateMatchSummary(input: GenerateMatchSummaryInput): Promise<GenerateMatchSummaryOutput> {
  return generateMatchSummaryFlow(input);
}

const generateMatchSummaryPrompt = ai.definePrompt({
  name: 'generateMatchSummaryPrompt',
  input: {schema: GenerateMatchSummaryInputSchema},
  output: {schema: GenerateMatchSummaryOutputSchema},
  prompt: `You are an AI matchmaker. Analyze the following user profile and team opening requirements and generate a personalized summary of the potential teammate and why they are a good match. Also, provide a numerical rank indicating the suitability of the match, from 1 to 10, where 10 is the best match.

User Profile:
{{{userProfile}}}

Team Opening Requirements:
{{{teamOpeningRequirements}}}

Summary:
Rank:`,
});

const generateMatchSummaryFlow = ai.defineFlow(
  {
    name: 'generateMatchSummaryFlow',
    inputSchema: GenerateMatchSummaryInputSchema,
    outputSchema: GenerateMatchSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateMatchSummaryPrompt(input);
    return output!;
  }
);
