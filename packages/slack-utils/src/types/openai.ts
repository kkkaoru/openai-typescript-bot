import { ConfigurationParameters } from 'openai';
import { ChatCompletionOptionalParameters, MaxMessages } from '../openai/chat-completion';

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> & ChatCompletionOptionalParameters & MaxMessages;
