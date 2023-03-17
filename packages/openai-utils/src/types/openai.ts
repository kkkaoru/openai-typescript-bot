import type { ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import type { OpenAiModel } from '@kkkaoru/openai-models';

export type MaxChatCompletionMessages = {
  maxMessagesCount?: number | string;
};

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> &
  ChatCompletionOptionalParameters &
  MaxChatCompletionMessages;

export type ChatCompletionOptionalParameters = {
  systemMessageContent?: string;
  model?: OpenAiModel;
} & Omit<CreateChatCompletionRequest, 'model'>;

export type OpenAiLogger = {
  appLog?: (args: unknown) => unknown;
  errorLog?: (args: unknown) => unknown;
};
