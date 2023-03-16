import type { ChatCompletionRequestMessage, ConfigurationParameters } from 'openai';
import { ChatCompletionOptionalParameters, DEFAULT_CHAT_COMPLETION_MODEL } from '../../../types';
import { createOpenAIClient } from '../../openai-client';
import { filterIsNaNValues } from '../filter/filter-nan-values';

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
  const filteredRequestParams = filterIsNaNValues(fetchRequestParams);
  const result = await client.createChatCompletion({
    model,
    messages: [...systemMessage, ...messages],
    ...filteredRequestParams,
  });
  return result.data.choices[0].message?.content;
}
