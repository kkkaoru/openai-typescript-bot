import type { ChatCompletionRequestMessage } from 'openai';
import { cutMessages, fetchChatCompletion, FetchChatCompletionArgs } from '@kkkaoru/openai-utils';
import type { AppLogger, CustomTextMessage, MiddlewareMentionArgs, OpenAiProps } from '../../../types';
import type { RecursiveCallback } from '../../utils/recursive/recursive-callback';

export type GenerateRecursiveAnswerCallbackArgs = {
  openaiMessages: ChatCompletionRequestMessage[];
} & OpenAiProps &
  AppLogger &
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
      logger: { appLog, errorLog },
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
