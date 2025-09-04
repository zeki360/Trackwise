'use server';

import { suggestIssueCategory } from '@/ai/flows/suggest-issue-category';
import { z } from 'zod';

const SuggestionResultSchema = z.object({
  suggestedCategories: z.array(z.string()).optional(),
  error: z.string().optional(),
});
type SuggestionResult = z.infer<typeof SuggestionResultSchema>;

export async function getCategorySuggestion(
  issueDescription: string
): Promise<SuggestionResult> {
  if (!issueDescription) {
    return { error: 'Issue description cannot be empty.' };
  }

  try {
    const result = await suggestIssueCategory({ issueDescription });
    return { suggestedCategories: result.suggestedCategories };
  } catch (e) {
    console.error(e);
    // This could be a more user-friendly error.
    return { error: 'An error occurred while getting AI suggestions.' };
  }
}
