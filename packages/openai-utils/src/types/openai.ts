import { ConfigurationParameters } from 'openai';
import { ChatCompletionOptionalParameters, MaxChatCompletionMessages } from '../openai/chat-completion';

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> &
  ChatCompletionOptionalParameters &
  MaxChatCompletionMessages;
