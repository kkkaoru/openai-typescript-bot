// https://platform.openai.com/docs/models/overview
export const OPENAI_GPT_RECOMMENDED_MODEL = 'gpt-3.5-turbo' as const;

export const openAiGpt4Models = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314'] as const;
export const openAiGpt3_5Models = [
  OPENAI_GPT_RECOMMENDED_MODEL,
  'gpt-3.5-turbo-0301',
  'text-davinci-003',
  'text-davinci-002',
  'code-davinci-002',
] as const;

export type OpenAiGpt4Model = (typeof openAiGpt4Models)[number];
export type OpenAiGpt3_5Model = (typeof openAiGpt3_5Models)[number];

export type OpenAiModel = OpenAiGpt4Model | OpenAiGpt3_5Model;
