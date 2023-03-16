import type { ConfigurationParameters, CreateChatCompletionRequest } from 'openai';

export const DEFAULT_CHAT_COMPLETION_MODEL = 'gpt-3.5-turbo';

export type MaxChatCompletionMessages = {
  maxMessagesCount?: number | string;
};

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> &
  ChatCompletionOptionalParameters &
  MaxChatCompletionMessages;

export type ChatCompletionOptionalParameters = {
  systemMessageContent?: string;
  model?: typeof DEFAULT_CHAT_COMPLETION_MODEL;
} & Omit<CreateChatCompletionRequest, 'model'>;
