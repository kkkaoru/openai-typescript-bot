import type { ChatCompletionRequestMessage, ConfigurationParameters } from 'openai';
import { Loggers, removeNaNValues } from '@kkkaoru/bot-utils';
import { ChatCompletionOptionalParameters } from '../../../types';
import { createOpenAIClient } from '../../openai-client';

export type FetchChatCompletionArgs = {
  fetchParams: ChatCompletionOptionalParameters;
  clientParams: ConfigurationParameters;
  loggers?: Loggers;
};

export async function fetchChatCompletion({
  fetchParams,
  clientParams,
  loggers,
}: FetchChatCompletionArgs): Promise<string | undefined> {
  const { systemMessageContent, model = 'gpt-3.5-turbo', messages, ...fetchRequestParams } = fetchParams;
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
  const filteredRequestParams = removeNaNValues(fetchRequestParams);
  const createChatCompletionArgs = {
    model,
    messages: [...systemMessage, ...messages],
    ...filteredRequestParams,
  };
  loggers?.appLog?.('createChatCompletion');
  loggers?.appLog?.({ createChatCompletionArgs });
  const result = await client.createChatCompletion(createChatCompletionArgs).catch((error) => {
    loggers?.errorLog?.('createChatCompletion error');
    loggers?.errorLog?.(error);
    throw error;
  });
  return result.data.choices[0].message?.content;
}
