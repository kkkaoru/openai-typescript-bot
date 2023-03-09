import { ChatCompletionRequestMessage, ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import { createOpenAIClient } from '../openai-client';
import { CHAT_COMPLETION_SYSTEM_CONTENT } from './system-content';

export type ChatCompletionOptionalParameters = {
  enabledSystemContent?: '' | boolean | string | null | undefined;
} & Pick<
  CreateChatCompletionRequest,
  'max_tokens' | 'temperature' | 'top_p' | 'presence_penalty' | 'frequency_penalty' | 'logit_bias' | 'n' | 'stop'
>;

export type FetchChatCompletionArgs = {
  model?: string;
} & ConfigurationParameters &
  Pick<CreateChatCompletionRequest, 'messages'> &
  ChatCompletionOptionalParameters;

export async function fetchChatCompletion({
  apiKey,
  model = 'gpt-3.5-turbo',
  messages,
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
  const systemMessage: ChatCompletionRequestMessage[] = Boolean(enabledSystemContent)
    ? [
        {
          role: 'system',
          content: CHAT_COMPLETION_SYSTEM_CONTENT,
        },
      ]
    : [];
  const result = await client.createChatCompletion({
    model,
    max_tokens: Number.isNaN(max_tokens) ? 4096 : Number(max_tokens),
    temperature: Number.isNaN(temperature) ? 1 : Number(temperature),
    top_p: Number.isNaN(top_p) ? 1 : Number(top_p),
    n: Number.isNaN(n) ? 1 : Number(n),
    presence_penalty: Number.isNaN(presence_penalty) ? 0 : Number(presence_penalty),
    frequency_penalty: Number.isNaN(frequency_penalty) ? 0 : Number(frequency_penalty),
    logit_bias,
    messages: [...systemMessage, ...messages],
  });
  return result.data.choices[0].message?.content;
}
