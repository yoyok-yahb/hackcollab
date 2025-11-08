'use server';

/**
 * @fileOverview A content moderation flow to detect and censor inappropriate language.
 *
 * - moderateContent - A function that censors a given text if it contains foul language.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z.string().describe('The text to be moderated.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe('Whether the text is appropriate or not.'),
  censoredText: z
    .string()
    .describe(
      'The original text, or a censored version if it was inappropriate.'
    ),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(
  input: ModerateContentInput
): Promise<ModerateContentOutput> {
  return contentModerationFlow(input);
}

const contentModerationPrompt = ai.definePrompt({
  name: 'contentModerationPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are a content moderator for a professional networking chat application. Your task is to detect and censor any foul language, swear words, or otherwise inappropriate content in the user's message.

  Analyze the following text:
  "{{{text}}}"

  If the text is appropriate, set 'isAppropriate' to true and return the original text in 'censoredText'.
  If the text contains inappropriate language, set 'isAppropriate' to false and return a censored version of the text in 'censoredText', replacing the inappropriate words with asterisks (e.g., 'f***'). Be sure to maintain the original word length.`,
});

const contentModerationFlow = ai.defineFlow(
  {
    name: 'contentModerationFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await contentModerationPrompt(input);
    return output!;
  }
);
