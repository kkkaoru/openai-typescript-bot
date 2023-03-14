import { ConfigurationParameters } from 'openai';
import { ChatCompletionOptionalParameters } from '../openai/chat-completion';

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> & ChatCompletionOptionalParameters;
