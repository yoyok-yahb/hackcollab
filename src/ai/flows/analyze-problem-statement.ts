
'use server';

/**
 * @fileOverview Analyzes a hackathon problem statement and provides a detailed breakdown.
 *
 * - analyzeProblemStatement - Analyzes the problem statement.
 * - AnalyzeProblemStatementInput - Input for the flow.
 * - AnalyzeProblemStatementOutput - Output for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeProblemStatementInputSchema = z.object({
  problemStatement: z.string().describe('The problem statement to analyze.'),
  solutionAttempt: z.string().optional().describe('An optional existing solution to analyze and get feedback on.'),
});

export type AnalyzeProblemStatementInput = z.infer<typeof AnalyzeProblemStatementInputSchema>;

const AnalyzeProblemStatementOutputSchema = z.object({
  solution: z.string().describe('A potential solution for the problem statement.'),
  techStack: z.array(z.string()).describe('A suggested tech stack to implement the solution.'),
  workflowDiagram: z.string().describe('A simple text-based workflow diagram (e.g., using -> arrows).'),
  requiredSkills: z.array(z.string()).describe('A list of skills required for the team.'),
  estimatedBuildTime: z.string().describe('A rough estimate of the time required to build an MVP.'),
  feasibility: z.string().describe('A brief analysis of the feasibility of building this during a hackathon.'),
});

export type AnalyzeProblemStatementOutput = z.infer<typeof AnalyzeProblemStatementOutputSchema>;

export async function analyzeProblemStatement(
  input: AnalyzeProblemStatementInput
): Promise<AnalyzeProblemStatementOutput> {
  return analyzeProblemStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProblemStatementPrompt',
  input: { schema: AnalyzeProblemStatementInputSchema },
  output: { schema: AnalyzeProblemStatementOutputSchema },
  prompt: `You are an expert hackathon mentor and software architect. Analyze the given problem statement.

Problem Statement:
"{{{problemStatement}}}"

{{#if solutionAttempt}}
The user has provided a solution to review:
"{{{solutionAttempt}}}"
Your task is to analyze their solution and provide feedback and suggestions. Base your response on their proposed solution.
{{else}}
The user has not provided a solution. Your task is to brainstorm a potential solution.
{{/if}}

Provide a detailed breakdown including:
1.  **Solution**: Describe a clear, concise solution. If a user provided one, critique and improve it.
2.  **Tech Stack**: Suggest a modern and appropriate tech stack (e.g., Next.js, Firebase, Python, etc.).
3.  **Workflow Diagram**: Create a simple, text-based flowchart showing the main user flow or data flow. Use arrows like '->' and boxes like '[Component]'.
4.  **Required Skills**: List the key skills the team would need (e.g., Frontend Dev, UI/UX, Backend, AI/ML).
5.  **Estimated Build Time**: Give a realistic time estimate to build a Minimum Viable Product (MVP) during a typical hackathon (e.g., "12-18 hours").
6.  **Feasibility**: Briefly explain how feasible this project is for a hackathon setting.

Your entire response must be a single JSON object that conforms to the specified output schema.
`,
});

const analyzeProblemStatementFlow = ai.defineFlow(
  {
    name: 'analyzeProblemStatementFlow',
    inputSchema: AnalyzeProblemStatementInputSchema,
    outputSchema: AnalyzeProblemStatementOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
