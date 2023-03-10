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
  difficultyMessage?: string;
  hasSaidRetryMessage?: boolean;
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
    retryMessages = undefined,
    difficultyMessage = 'I am sorry, but I am not good at answering this question.',
    hasSaidRetryMessage = false,
  } = args;
  if (retryMessages !== undefined && retryMessages?.length === 0) {
    await say({ thread_ts: event.ts, text: difficultyMessage });
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
    // Fetch OpenAI
    appLog?.('try fetch openai');
    appLog?.(fetchChatCompletionArgs);
    const message = await fetchChatCompletion(fetchChatCompletionArgs);
    appLog?.('fetched openai');
    appLog?.(message);
    // Say Slack
    const sayArgs = { thread_ts: event.ts, text: message };
    appLog?.('try say slack');
    appLog?.(sayArgs);
    await say(sayArgs).then(() => {
      appLog?.(sayArgs);
    });
  } catch (error) {
    errorLog?.(error);
    appLog?.(`retry count is ${retryCount}`);
    if (retryCount <= retryMaxCount) {
      if (!hasSaidRetryMessage) {
        await say({ thread_ts: event.ts, text: retryText });
      }
      setTimeout(() => {
        answer({ ...args, retryCount: retryCount + 1, retryMessages: messages.slice(1), hasSaidRetryMessage: true });
      }, retryDelayMs);
      return;
    }
    errorLog?.(error);
    await say({ thread_ts: event.ts, text: `${error?.toString()}` });
  }
}
