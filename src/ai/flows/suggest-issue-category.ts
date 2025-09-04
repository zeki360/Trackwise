'use server';

/**
 * @fileOverview AI flow to suggest issue categories based on the user's description.
 *
 * - suggestIssueCategory - Function to suggest the most relevant issue categories.
 * - SuggestIssueCategoryInput - Input type for the suggestIssueCategory function.
 * - SuggestIssueCategoryOutput - Output type for the suggestIssueCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIssueCategoryInputSchema = z.object({
  issueDescription: z
    .string()
    .describe('A detailed description of the issue being reported.'),
});
export type SuggestIssueCategoryInput = z.infer<typeof SuggestIssueCategoryInputSchema>;

const SuggestIssueCategoryOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested issue categories.'),
});
export type SuggestIssueCategoryOutput = z.infer<typeof SuggestIssueCategoryOutputSchema>;

export async function suggestIssueCategory(input: SuggestIssueCategoryInput): Promise<SuggestIssueCategoryOutput> {
  return suggestIssueCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIssueCategoryPrompt',
  input: {schema: SuggestIssueCategoryInputSchema},
  output: {schema: SuggestIssueCategoryOutputSchema},
  prompt: `Given the following issue description, suggest the most relevant categories from the following list: Facility (external, internal), IT (hardware, software, office machines, internet, repair), Purchase. Return only the categories that are relevant, do not return any categories that are not relevant. Categories should be returned as a JSON array of strings.

Issue Description: {{{issueDescription}}}`,
});

const suggestIssueCategoryFlow = ai.defineFlow(
  {
    name: 'suggestIssueCategoryFlow',
    inputSchema: SuggestIssueCategoryInputSchema,
    outputSchema: SuggestIssueCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
