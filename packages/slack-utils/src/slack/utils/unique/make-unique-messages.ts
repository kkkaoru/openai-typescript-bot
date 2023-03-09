import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';

export function makeUniqueMessages(messages: Message[]): Message[] {
  return messages.filter((a, i) => messages.findIndex((s) => a.ts === s.ts) === i);
}
