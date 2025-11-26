'use server';
/**
 * @fileOverview An AI caseworker flow that answers user queries about Philippine government services.
 *
 * - aiCaseworkerUserQuery - A function that handles user queries and returns helpful guidance.
 * - AICaseworkerUserQueryInput - The input type for the aiCaseworkerUserQuery function.
 * - AICaseworkerUserQueryOutput - The return type for the aiCaseworkerUserQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICaseworkerUserQueryInputSchema = z.object({
  query: z.string().describe('The user query about Philippine government services.'),
});
export type AICaseworkerUserQueryInput = z.infer<typeof AICaseworkerUserQueryInputSchema>;

const AICaseworkerUserQueryOutputSchema = z.object({
  response: z.string().describe('The AI caseworker response to the user query.'),
});
export type AICaseworkerUserQueryOutput = z.infer<typeof AICaseworkerUserQueryOutputSchema>;

export async function aiCaseworkerUserQuery(input: AICaseworkerUserQueryInput): Promise<AICaseworkerUserQueryOutput> {
  return aiCaseworkerUserQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCaseworkerUserQueryPrompt',
  input: {schema: AICaseworkerUserQueryInputSchema},
  output: {schema: AICaseworkerUserQueryOutputSchema},
  prompt: `You are an AI Caseworker specializing in providing guidance on Philippine government services.

  A user has the following question:
  {{query}}

  Provide a helpful and informative response to the user's query. Focus on clarity and accuracy, and explain the process and requirements. Be as concise as possible and break the process up into numbered steps. Format as markdown.
  `,
});

const aiCaseworkerUserQueryFlow = ai.defineFlow(
  {
    name: 'aiCaseworkerUserQueryFlow',
    inputSchema: AICaseworkerUserQueryInputSchema,
    outputSchema: AICaseworkerUserQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
