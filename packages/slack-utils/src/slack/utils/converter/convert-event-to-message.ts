import { AppMentionEvent } from '@slack/bolt';
import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';

export function convertMessageFromMentionEvent(event: AppMentionEvent): Message {
  const { type, username, ...message } = event;
  return message;
}
