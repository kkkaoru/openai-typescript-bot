import { fetchChatCompletion, FetchChatCompletionArgs } from '../../../openai';
import { ChatCompletionRequestMessage } from 'openai';
import { createChatCompletionRequestMessages } from './create-chat-completion-request-messages';
import type { AppLogger, OpenaiParameters, MiddlewareMentionArgs } from '../../../types';

export type AnswerArgs = {
  openai?: OpenaiParameters;
  retryMaxCount?: number;
  retryCount?: number;
  retryDelayMs?: number;
  retryText?: string;
  retryMessages?: ChatCompletionRequestMessage[];
} & AppLogger;

export async function answer(args: MiddlewareMentionArgs & AnswerArgs) {
  const {
    appLog,
    errorLog,
    openai,
    event,
    client,
    say,
    retryMaxCount = 10,
    retryCount = 0,
    retryDelayMs = 1000,
    retryText = '...',
    retryMessages,
  } = args;
  if (retryMessages?.length === 0) {
    throw new Error('messages is too difficult to understand');
  }
  const messages =
    retryMessages?.length === undefined
      ? await createChatCompletionRequestMessages({ appLog, client, event, maxMessagesCount: openai?.maxMessagesCount })
      : retryMessages;
  const fetchChatCompletionArgs: FetchChatCompletionArgs = {
    messages,
    ...openai,
  };
  try {
    appLog?.('try fetch openai');
    appLog?.(fetchChatCompletionArgs);
    // Fetch OpenAI
    const message = await fetchChatCompletion(fetchChatCompletionArgs);
    // Say Slack
    appLog?.('try say slack');
    const sayArgs = { thread_ts: event.ts, text: message };
    await say(sayArgs).then(() => {
      appLog?.(sayArgs);
    });
  } catch (error) {
    errorLog?.(error);
    appLog?.(`retry count is ${retryCount}`);
    if (retryCount <= retryMaxCount) {
      await say({ thread_ts: event.ts, text: retryText });
      setTimeout(() => {
        answer({ ...args, retryCount: retryCount + 1, retryMessages: messages.slice(1) });
      }, retryDelayMs);
      return;
    }
    errorLog?.(error);
    await say({ thread_ts: event.ts, text: `${error?.toString()}` });
  }
}
