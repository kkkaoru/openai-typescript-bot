import { createChatCompletionRequestMessages, fetchThreadMessagesIfCan, recursivePromiseCallback } from '../../utils';
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
  const fetchThreadMessagesArgs = {
    client,
    channel: event.channel,
    thread_ts: event.thread_ts,
  };
  appLog?.('try fetch thread messages');
  appLog?.(fetchThreadMessagesArgs);
  const threadMessages = await fetchThreadMessagesIfCan(fetchThreadMessagesArgs);
  const createMessagesArgs = {
    threadMessages,
    event,
    maxMessagesCount: openai?.maxMessagesCount,
  };
  appLog?.('try create chat completion request messages');
  appLog?.(createMessagesArgs);
  const openaiMessages = createChatCompletionRequestMessages(createMessagesArgs);
  const generateCallbackArgs = {
    openaiMessages,
    openai,
    event,
    thinkingText,
    say,
    appLog,
    errorLog,
  };

  appLog?.('try generate recursive answer callback');
  appLog?.(generateCallbackArgs);
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
    const recursivePromiseCallbackArgs = {
      callback,
      appLog,
      errorLog,
      retryCount: 0,
    };
    appLog?.('try recursive promise callback');
    appLog?.(recursivePromiseCallbackArgs);
    recursivePromiseCallback(recursivePromiseCallbackArgs);
  } catch (error) {
    errorLog?.(error);
    await say({ thread_ts: event.ts, text: gaveUpText });
    throw error;
  }
}
