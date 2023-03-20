import type { ChatCompletionRequestMessage } from 'openai';
import { cutMessages, fetchChatCompletion, FetchChatCompletionArgs } from '@kkkaoru/openai-utils';
import type { RecursiveCallback, Loggers } from '@kkkaoru/bot-utils';
import type { CustomTextMessage, MiddlewareMentionArgs, OpenAiProps } from '../../../types';

export type GenerateRecursiveAnswerCallbackArgs = {
  openaiMessages: ChatCompletionRequestMessage[];
} & OpenAiProps &
  Loggers &
  Pick<CustomTextMessage, 'thinkingText'> &
  Pick<MiddlewareMentionArgs, 'say' | 'event'>;

export function generateRecursiveAnswerCallback({
  event,
  say,
  thinkingText,
  appLog,
  errorLog,
  openaiMessages,
  openai,
}: GenerateRecursiveAnswerCallbackArgs) {
  const callback: RecursiveCallback = async ({ retryCount = 0 }) => {
    if (retryCount === 1) {
      await say({ thread_ts: event.ts, text: thinkingText });
    }
    const messages = retryCount >= 1 ? cutMessages(openaiMessages) : openaiMessages;

    const { apiKey, ...openaiParams } = openai;
    const fetchChatCompletionArgs: FetchChatCompletionArgs = {
      fetchParams: { ...openaiParams, messages },
      clientParams: { apiKey },
      loggers: { appLog, errorLog },
    };
    appLog?.('try fetchChatCompletion');
    appLog?.(fetchChatCompletionArgs);
    const text = await fetchChatCompletion(fetchChatCompletionArgs);
    const sayArgs = { thread_ts: event.ts, text };
    appLog?.('try say');
    appLog?.(sayArgs);
    await say(sayArgs);
  };
  return {
    callback,
  };
}
