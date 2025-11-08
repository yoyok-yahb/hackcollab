'use server';

/**
 * @fileOverview AI-driven profile verification flow.
 *
 * This flow analyzes user profiles to detect fake or incomplete information.
 * - aiDrivenProfileVerification - The main function to trigger the profile verification process.
 * - AiDrivenProfileVerificationInput - The input type for the aiDrivenProfileVerification function.
 * - AiDrivenProfileVerificationOutput - The output type for the aiDrivenProfileVerification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDrivenProfileVerificationInputSchema = z.object({
  profileText: z
    .string()
    .describe('The text content of the user profile to be verified.'),
  socialLinks: z
    .array(z.string())
    .describe('An array of social media links associated with the profile.'),
});
export type AiDrivenProfileVerificationInput = z.infer<
  typeof AiDrivenProfileVerificationInputSchema
>;

const AiDrivenProfileVerificationOutputSchema = z.object({
  isLegitimate: z
    .boolean()
    .describe('Whether the profile is likely to be legitimate or not.'),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the determination of the profile legitimacy.'
    ),
  flags: z
    .array(z.string())
    .describe(
      'Any flags raised by the AI, such as incomplete information or suspicious activity.'
    ),
});
export type AiDrivenProfileVerificationOutput = z.infer<
  typeof AiDrivenProfileVerificationOutputSchema
>;

export async function aiDrivenProfileVerification(
  input: AiDrivenProfileVerificationInput
): Promise<AiDrivenProfileVerificationOutput> {
  return aiDrivenProfileVerificationFlow(input);
}

const aiDrivenProfileVerificationPrompt = ai.definePrompt({
  name: 'aiDrivenProfileVerificationPrompt',
  input: {schema: AiDrivenProfileVerificationInputSchema},
  output: {schema: AiDrivenProfileVerificationOutputSchema},
  prompt: `You are an AI assistant specializing in detecting fake or incomplete user profiles on a matchmaking platform.

  Analyze the following user profile information and determine if the profile is legitimate or not. Provide your reasoning and any flags raised.

  Profile Text: {{{profileText}}}
  Social Links: {{#each socialLinks}}{{{this}}}, {{/each}}

  Consider factors such as the completeness of the profile, the presence of social links, and any suspicious activity mentioned in the profile text.

  Output a JSON object with the following schema:
  ${JSON.stringify(AiDrivenProfileVerificationOutputSchema.shape, null, 2)}`,
});

const aiDrivenProfileVerificationFlow = ai.defineFlow(
  {
    name: 'aiDrivenProfileVerificationFlow',
    inputSchema: AiDrivenProfileVerificationInputSchema,
    outputSchema: AiDrivenProfileVerificationOutputSchema,
  },
  async input => {
    const {output} = await aiDrivenProfileVerificationPrompt(input);
    return output!;
  }
);
