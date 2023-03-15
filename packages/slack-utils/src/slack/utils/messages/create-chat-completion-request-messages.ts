import { ChatCompletionRequestMessage } from 'openai';
import type { WebClient } from '@slack/web-api';
import type { AppMentionEvent } from '@slack/bolt';
import { convertChatCompletionMessagesFromSlack, MaxChatCompletionMessages } from '@kkkaoru/openai-utils';
import { AppLogger } from '../../../types';
import { fetchThreadMessagesIfCan } from '../fetch';
import { convertMessageFromMentionEvent } from '../converter';
import { makeUniqueMessages } from '../unique';

export type CreateChatCompletionRequestMessagesArgs = {
  client: WebClient;
  event: AppMentionEvent;
} & MaxChatCompletionMessages &
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
  return convertChatCompletionMessagesFromSlack({
    slackMessages: uniqueMessages,
    maxMessagesCount,
  });
}
