'use server';

/**
 * @fileOverview AI-powered teammate discovery flow that suggests potential teammates based on user profiles and team openings.
 *
 * - findPotentialTeammates - A function to retrieve potential teammates.
 * - FindPotentialTeammatesInput - The input type for the findPotentialTeammates function.
 * - FindPotentialTeammatesOutput - The return type for the findPotentialTeammates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindPotentialTeammatesInputSchema = z.object({
  userProfile: z.string().describe('The current user profile data as a JSON string.'),
  teamOpenings: z.string().describe('Available team openings data as a JSON string.'),
});
export type FindPotentialTeammatesInput = z.infer<typeof FindPotentialTeammatesInputSchema>;

const PotentialTeammateSchema = z.object({
  userId: z.string().describe('The unique identifier of the potential teammate.'),
  matchScore: z.number().describe('A score indicating the compatibility between the user and the potential teammate (0-1).'),
  summary: z.string().describe('A short summary explaining why this user is a good match.'),
});

const FindPotentialTeammatesOutputSchema = z.array(PotentialTeammateSchema);
export type FindPotentialTeammatesOutput = z.infer<typeof FindPotentialTeammatesOutputSchema>;

export async function findPotentialTeammates(input: FindPotentialTeammatesInput): Promise<FindPotentialTeammatesOutput> {
  return findPotentialTeammatesFlow(input);
}

const findPotentialTeammatesPrompt = ai.definePrompt({
  name: 'findPotentialTeammatesPrompt',
  input: {schema: FindPotentialTeammatesInputSchema},
  output: {schema: FindPotentialTeammatesOutputSchema},
  prompt: `You are an AI assistant designed to find potential teammates for hackathons.

  Analyze the current user's profile and available team openings to identify the best matches.
  Provide a match score (0-1) and a summary explaining why each potential teammate is a good fit.

  Current User Profile:
  {{userProfile}}

  Available Team Openings:
  {{teamOpenings}}

  Format your response as a JSON array of potential teammates, including their userId, matchScore, and summary.
  Ensure the matchScore is a number between 0 and 1, and the summary is concise and informative.
  `,
});

const findPotentialTeammatesFlow = ai.defineFlow(
  {
    name: 'findPotentialTeammatesFlow',
    inputSchema: FindPotentialTeammatesInputSchema,
    outputSchema: FindPotentialTeammatesOutputSchema,
  },
  async input => {
    try {
      const {output} = await findPotentialTeammatesPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in findPotentialTeammatesFlow:', error);
      throw error;
    }
  }
);
