'use server';

/**
 * @fileOverview An AI flow to find the best team opening for a user.
 *
 * - findBestOpening - A function that recommends the best opening for a user based on their profile.
 * - FindBestOpeningInput - The input type for the findBestOpening function.
 * - FindBestOpeningOutput - The return type for the findBestOpening function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindBestOpeningInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The JSON string of the current user\'s profile.'),
  openings: z
    .string()
    .describe(
      'A JSON string representing an array of available team openings.'
    ),
});
export type FindBestOpeningInput = z.infer<typeof FindBestOpeningInputSchema>;

const FindBestOpeningOutputSchema = z.object({
  bestOpeningId: z
    .string()
    .describe(
      'The ID of the opening that is the best match for the user.'
    ),
  reasoning: z
    .string()
    .describe('A brief explanation of why this opening is the best match.'),
});
export type FindBestOpeningOutput = z.infer<
  typeof FindBestOpeningOutputSchema
>;

export async function findBestOpening(
  input: FindBestOpeningInput
): Promise<FindBestOpeningOutput> {
  return findBestOpeningFlow(input);
}

const findBestOpeningPrompt = ai.definePrompt({
  name: 'findBestOpeningPrompt',
  input: {schema: FindBestOpeningInputSchema},
  output: {schema: FindBestOpeningOutputSchema},
  prompt: `You are an expert matchmaker for a hackathon team-finding platform. Your task is to analyze a user's profile and a list of available team openings and determine the single best opening for that user.

Consider the user's skills, experience, and bio, and match them against the required roles, tech stack, and project idea of each opening.

User Profile:
{{{userProfile}}}

Available Openings:
{{{openings}}}

Identify the single best opening and provide a brief reason for your choice. Your response must be in a JSON format.`,
});

const findBestOpeningFlow = ai.defineFlow(
  {
    name: 'findBestOpeningFlow',
    inputSchema: FindBestOpeningInputSchema,
    outputSchema: FindBestOpeningOutputSchema,
  },
  async input => {
    const {output} = await findBestOpeningPrompt(input);
    return output!;
  }
);
