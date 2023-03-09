import { ChatCompletionRequestMessage, ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import { createOpenAIClient } from '../openai-client/create-openai-client';
import { CHAT_COMPLETION_SYSTEM_CONTENT } from './system-content';

export type ChatCompletionOptionalParameters = {
  enabledSystemContent?: boolean;
} & Pick<
  CreateChatCompletionRequest,
  'max_tokens' | 'temperature' | 'top_p' | 'presence_penalty' | 'frequency_penalty' | 'logit_bias' | 'n' | 'stop'
>;

export type FetchChatCompletionArgs = {
  model?: string;
  userContent: string;
  userName?: string;
  enabledSystemContent?: boolean;
} & ConfigurationParameters &
  Pick<CreateChatCompletionRequest, 'messages'> &
  ChatCompletionOptionalParameters;

export async function fetchChatCompletion({
  apiKey,
  model = 'gpt-3.5-turbo',
  messages,
  userContent,
  userName,
  enabledSystemContent = false,
  max_tokens = 4096,
  temperature = 1,
  top_p = 1,
  n = 1,
  presence_penalty = 0,
  frequency_penalty = 0,
  logit_bias = undefined,
}: FetchChatCompletionArgs): Promise<string | undefined> {
  const client = createOpenAIClient({ apiKey });
  const systemMessage: ChatCompletionRequestMessage[] = enabledSystemContent
    ? [
        {
          role: 'system',
          content: CHAT_COMPLETION_SYSTEM_CONTENT,
        },
      ]
    : [];
  const result = await client.createChatCompletion({
    model,
    max_tokens,
    temperature,
    top_p,
    n,
    presence_penalty,
    frequency_penalty,
    logit_bias,
    messages: [
      ...systemMessage,
      ...messages,
      {
        role: 'user',
        content: userContent,
        name: userName,
      },
    ],
  });
  return result.data.choices[0].message?.content;
}
