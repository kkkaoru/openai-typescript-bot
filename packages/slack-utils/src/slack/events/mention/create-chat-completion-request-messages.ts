import { ChatCompletionRequestMessage } from 'openai';
import type { WebClient } from '@slack/web-api';
import type { AppMentionEvent } from '@slack/bolt';
import { convertChatCompletionMessages, MaxMessages } from '../../../openai';
import { fetchThreadMessagesIfCan, makeUniqueMessages, convertMessageFromMentionEvent } from '../../utils';
import { AppLogger } from '../../../types';

export type CreateChatCompletionRequestMessagesArgs = {
  client: WebClient;
  event: AppMentionEvent;
} & MaxMessages &
  Pick<AppLogger, 'appLog'>;

export async function createChatCompletionRequestMessages({
  appLog,
  client,
  event,
  maxMessagesCount,
}: CreateChatCompletionRequestMessagesArgs): Promise<ChatCompletionRequestMessage[]> {
  appLog?.('try fetch thread messages');
  const threadMessages = await fetchThreadMessagesIfCan({
    client,
    channel: event.channel,
    thread_ts: event.thread_ts,
  });
  appLog?.(threadMessages);
  const mentionMessage = convertMessageFromMentionEvent(event);
  const uniqueMessages = makeUniqueMessages([...threadMessages, mentionMessage]);
  return convertChatCompletionMessages({
    slackMessages: uniqueMessages,
    maxMessagesCount,
  });
}
