import type { ChatCompletionRequestMessage } from 'openai';
import { fetchChatCompletion } from '@kkkaoru/openai-utils';
import type { AppLogger, CustomTextMessage, MiddlewareMentionArgs, OpenAiProps } from '../../../types';
import type { RecursiveCallback } from '../../utils/recursive/recursive-callback';

export type GenerateRecursiveAnswerCallbackArgs = {
  openaiMessages?: ChatCompletionRequestMessage[];
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
  const callback: RecursiveCallback = async ({ retryCount }) => {
    if (retryCount === 1) {
      await say({ thread_ts: event.ts, text: thinkingText });
    }
    const messages = openaiMessages?.slice(retryCount);
    if (messages === undefined || messages?.length === 0) {
      errorLog?.('messages is empty');
      throw new Error('messages is empty');
    }
    const fetchChatCompletionArgs = { fetchParams: { ...openai, messages }, clientParams: { apiKey: openai.apiKey } };
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
