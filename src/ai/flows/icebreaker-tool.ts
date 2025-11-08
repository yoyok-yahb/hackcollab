'use server';

/**
 * @fileOverview Generates icebreaker questions or topics to initiate conversations with potential teammates.
 *
 * - generateIcebreaker - A function that generates icebreaker suggestions.
 * - GenerateIcebreakerInput - The input type for the generateIcebreaker function.
 * - GenerateIcebreakerOutput - The return type for the generateIcebreaker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerInputSchema = z.object({
  userProfile: z
    .string()
    .describe('Description of the user profile including skills and interests.'),
  teamOpening: z
    .string()
    .describe('Description of the team opening including project idea and required roles.'),
});

export type GenerateIcebreakerInput = z.infer<typeof GenerateIcebreakerInputSchema>;

const GenerateIcebreakerOutputSchema = z.object({
  icebreakerSuggestion: z
    .string()
    .describe('An icebreaker question or topic to start a conversation.'),
});

export type GenerateIcebreakerOutput = z.infer<typeof GenerateIcebreakerOutputSchema>;

export async function generateIcebreaker(input: GenerateIcebreakerInput): Promise<GenerateIcebreakerOutput> {
  return generateIcebreakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerPrompt',
  input: {schema: GenerateIcebreakerInputSchema},
  output: {schema: GenerateIcebreakerOutputSchema},
  prompt: `You are an AI assistant designed to help users find teammates for hackathons. You are given a user profile and a team opening description. Generate a suggestion for an icebreaker question or topic that the user can use to start a conversation with a potential teammate.

User Profile: {{{userProfile}}}
Team Opening: {{{teamOpening}}}

Suggestion:`,
});

const generateIcebreakerFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerFlow',
    inputSchema: GenerateIcebreakerInputSchema,
    outputSchema: GenerateIcebreakerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
