// https://platform.openai.com/docs/models/overview

export const openAIGpt4Models = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314'] as const;
export const openAIGpt3_5Models = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'text-davinci-003',
  'text-davinci-002',
  'code-davinci-002',
] as const;
export const openAIModels = [...openAIGpt4Models, ...openAIGpt3_5Models] as const;

export type OpenAiGpt4Model = (typeof openAIGpt4Models)[number];
export type OpenAiGpt3_5Model = (typeof openAIGpt3_5Models)[number];

export type OpenAiModel = OpenAiGpt4Model | OpenAiGpt3_5Model;
