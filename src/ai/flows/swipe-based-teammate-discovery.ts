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
import { TeamOpening } from '@/lib/data';

const FindPotentialTeammatesInputSchema = z.object({
  userProfile: z.string().describe('The current user profile data as a JSON string.'),
  potentialTeammates: z.string().describe('A JSON string of potential teammates to rank.'),
  teamOpening: z.string().optional().describe('The most recent team opening created by the user as a JSON string.'),
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

  Analyze the current user's profile, their latest team opening, and a list of potential teammates.
  Your goal is to rank the potential teammates based on how well they fit the user's profile and the requirements of the team opening.
  Provide a match score (0-1) and a summary explaining why each potential teammate is a good fit.

  Current User Profile:
  {{userProfile}}

  {{#if teamOpening}}
  User's Latest Team Opening:
  {{teamOpening}}
  {{/if}}

  Potential Teammates to evaluate:
  {{potentialTeammates}}

  Format your response as a JSON array of potential teammates, including their userId, matchScore, and summary.
  Ensure the matchScore is a number between 0 and 1, and the summary is concise and informative.
  The list should be sorted by matchScore in descending order.
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
