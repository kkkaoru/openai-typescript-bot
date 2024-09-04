// https://platform.openai.com/docs/models/overview
export const openAIGpt4oModels = ['gpt-4o', 'gpt-4o-2024-05-13', 'gpt-4o-2024-08-16', 'gpt-4o-latest'] as const;
export const openAIGpt4oMiniModels = ['gpt-4o-mini', 'gpt-4o-mini-2024-07-18'] as const;
export const openAIGpt4oTurboModels = ['gpt-4-turbo', 'gpt-4-turbo-2024-04-09', 'gpt-4-turbo-preview'] as const;
export const openAIGpt4Models = [
  'gpt-4',
  'gpt-4-0613',
  'gpt-4-0314',
  'gpt-4-0125-preview',
  'gpt-4-1106-preview',
] as const;
export const openAIGpt3_5Models = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-instruct',
] as const;
export const openAIModels = [
  ...openAIGpt4oModels,
  ...openAIGpt4oMiniModels,
  ...openAIGpt4oTurboModels,
  ...openAIGpt4Models,
  ...openAIGpt3_5Models,
] as const;

export type OpenAiGpt4Model = (typeof openAIGpt4Models)[number];
export type OpenAiGpt3_5Model = (typeof openAIGpt3_5Models)[number];
export type OpenAiGpt4oModel = (typeof openAIGpt4oModels)[number];
export type openAIGpt4oMiniModels = (typeof openAIGpt4oMiniModels)[number];
export type OpenAiGpt4turboModel = (typeof openAIGpt4oTurboModels)[number];

export type OpenAiModel =
  | OpenAiGpt4oModel
  | openAIGpt4oMiniModels
  | OpenAiGpt4turboModel
  | OpenAiGpt4Model
  | OpenAiGpt3_5Model;
