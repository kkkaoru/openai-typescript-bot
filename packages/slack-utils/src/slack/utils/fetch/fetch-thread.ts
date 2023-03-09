import type { WebClient } from '@slack/web-api';
import type { AppMentionEvent } from '@slack/bolt';
import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { trimMentions } from '../trim';

type FetchThreadMessagesArgs = {
  client: WebClient;
} & Pick<AppMentionEvent, 'channel' | 'thread_ts'>;

export async function fetchThreadMessagesIfCan({
  client,
  channel,
  thread_ts,
}: FetchThreadMessagesArgs): Promise<Message[]> {
  if (thread_ts === undefined) {
    return [];
  }
  const response = await client.conversations.replies({ channel, ts: thread_ts });
  if (response.messages === undefined) {
    return [];
  }
  return response.messages
    .sort((prev, cur) => Number(prev.ts) - Number(cur.ts))
    .map((message) => ({ ...message, text: trimMentions(message.text || '') }));
}
