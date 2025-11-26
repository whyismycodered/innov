'use server';
/**
 * @fileOverview Summarizes complex government service information into easy-to-understand steps.
 *
 * - summarizeServiceInformation - A function that summarizes government service information.
 * - SummarizeServiceInformationInput - The input type for the summarizeServiceInformation function.
 * - SummarizeServiceInformationOutput - The return type for the summarizeServiceInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeServiceInformationInputSchema = z.object({
  serviceName: z.string().describe('The name of the government service to summarize.'),
  serviceDetails: z.string().describe('Detailed information about the government service.'),
});
export type SummarizeServiceInformationInput = z.infer<typeof SummarizeServiceInformationInputSchema>;

const SummarizeServiceInformationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the government service information in easy-to-understand steps.'),
});
export type SummarizeServiceInformationOutput = z.infer<typeof SummarizeServiceInformationOutputSchema>;

export async function summarizeServiceInformation(input: SummarizeServiceInformationInput): Promise<SummarizeServiceInformationOutput> {
  return summarizeServiceInformationFlow(input);
}

const summarizeServiceInformationPrompt = ai.definePrompt({
  name: 'summarizeServiceInformationPrompt',
  input: {schema: SummarizeServiceInformationInputSchema},
  output: {schema: SummarizeServiceInformationOutputSchema},
  prompt: `You are an AI caseworker tasked with simplifying complex government service information for citizens.

  Summarize the following information about the {{serviceName}} service into easy-to-understand steps:
  \"\"\"{{serviceDetails}}\"\"\"`,
});

const summarizeServiceInformationFlow = ai.defineFlow(
  {
    name: 'summarizeServiceInformationFlow',
    inputSchema: SummarizeServiceInformationInputSchema,
    outputSchema: SummarizeServiceInformationOutputSchema,
  },
  async input => {
    const {output} = await summarizeServiceInformationPrompt(input);
    return output!;
  }
);
