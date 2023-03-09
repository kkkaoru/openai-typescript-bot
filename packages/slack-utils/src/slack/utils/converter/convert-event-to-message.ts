import { AppMentionEvent } from '@slack/bolt';
import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { trimMentions } from '../trim';

export function convertMessageFromMentionEvent(event: AppMentionEvent): Message {
  const { type, username, text, ...message } = event;
  return { ...message, text: trimMentions(text) };
}
