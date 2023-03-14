import type { ChatCompletionRequestMessage, ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import { createOpenAIClient } from '../../openai-client';
import { DEFAULT_CHAT_COMPLETION_MODEL } from '../default-values';

export type ChatCompletionOptionalParameters = {
  systemMessageContent?: string;
  model?: typeof DEFAULT_CHAT_COMPLETION_MODEL;
} & Omit<CreateChatCompletionRequest, 'model'>;

export type FetchChatCompletionArgs = {
  fetchParams: ChatCompletionOptionalParameters;
  clientParams: ConfigurationParameters;
};

export async function fetchChatCompletion({
  fetchParams,
  clientParams,
}: FetchChatCompletionArgs): Promise<string | undefined> {
  const { systemMessageContent, model = DEFAULT_CHAT_COMPLETION_MODEL, messages, ...fetchRequestParams } = fetchParams;
  const client = createOpenAIClient({ ...clientParams });
  const systemMessage: ChatCompletionRequestMessage[] =
    typeof systemMessageContent === 'string' && systemMessageContent !== ''
      ? [
          {
            role: 'system',
            content: systemMessageContent,
          },
        ]
      : [];
  const result = await client.createChatCompletion({
    model,
    messages: [...systemMessage, ...messages],
    ...fetchRequestParams,
  });
  return result.data.choices[0].message?.content;
}
