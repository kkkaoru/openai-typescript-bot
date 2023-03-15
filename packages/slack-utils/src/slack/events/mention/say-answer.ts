import { createChatCompletionRequestMessages, recursivePromiseCallback } from '../../utils';
import type { AppLogger, CustomTextMessage, MiddlewareMentionArgs, OpenAiProps } from '../../../types';
import { generateRecursiveAnswerCallback } from './generate-recursive-callback';

export type SayAnswerArgs = CustomTextMessage & MiddlewareMentionArgs & AppLogger & OpenAiProps;

export async function sayAnswer({
  event,
  say,
  thinkingText = '...',
  gaveUpText = "I'm sorry, but I am not good at answering this question.",
  errorLog,
  appLog,
  client,
  openai,
}: SayAnswerArgs) {
  const openaiMessages = await createChatCompletionRequestMessages({
    appLog,
    client,
    event,
    maxMessagesCount: openai?.maxMessagesCount,
  });

  const { callback } = generateRecursiveAnswerCallback({
    openaiMessages,
    openai,
    event,
    thinkingText,
    say,
    appLog,
    errorLog,
  });

  try {
    recursivePromiseCallback({
      callback,
      appLog,
      errorLog,
      retryCount: 0,
    });
  } catch (error) {
    errorLog?.(error);
    await say({ thread_ts: event.ts, text: gaveUpText });
    throw error;
  }
}
