import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { ChatCompletionRequestMessage } from 'openai';

export type MaxMessages = {
  maxMessagesCount?: number | string;
};

type ConverterMessagesArgs = {
  slackMessages: Message[];
} & MaxMessages;

const DEFAULT_MAX_MESSAGES_COUNT = 18;

export function convertChatCompletionMessages({
  slackMessages,
  maxMessagesCount = DEFAULT_MAX_MESSAGES_COUNT,
}: ConverterMessagesArgs): ChatCompletionRequestMessage[] {
  const maxCount = Number.isNaN(maxMessagesCount) ? DEFAULT_MAX_MESSAGES_COUNT : Number(maxMessagesCount);

  return [...slackMessages].splice(maxCount * -1, slackMessages.length).map(
    (message): ChatCompletionRequestMessage => ({
      role: message.bot_id ? 'assistant' : 'user',
      content: message.text || '',
      name: message.user,
    }),
  );
}
