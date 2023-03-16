import type { ChatCompletionRequestMessage, ConfigurationParameters } from 'openai';
import { ChatCompletionOptionalParameters, DEFAULT_CHAT_COMPLETION_MODEL, OpenAiLogger } from '../../../types';
import { createOpenAIClient } from '../../openai-client';
import { filterIsNaNValues } from '../filter/filter-nan-values';

export type FetchChatCompletionArgs = {
  fetchParams: ChatCompletionOptionalParameters;
  clientParams: ConfigurationParameters;
  logger?: OpenAiLogger;
};

export async function fetchChatCompletion({
  fetchParams,
  clientParams,
  logger,
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
  const createChatCompletionArgs = {
    model,
    messages: [...systemMessage, ...messages],
    ...filteredRequestParams,
  };
  logger?.appLog?.('createChatCompletion');
  logger?.appLog?.({ createChatCompletionArgs });
  const result = await client.createChatCompletion(createChatCompletionArgs).catch((error) => {
    logger?.errorLog?.('createChatCompletion error');
    logger?.errorLog?.(error);
    throw error;
  });
  return result.data.choices[0].message?.content;
}
