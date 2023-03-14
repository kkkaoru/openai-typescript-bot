import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import type { ChatCompletionRequestMessage } from 'openai';
import { DEFAULT_MAX_CHAT_COMPLETION_MESSAGES_COUNT } from '../default-values';

export type MaxChatCompletionMessages = {
  maxMessagesCount?: number | string;
};

export type ConverterMessagesArgs = {
  slackMessages: Message[];
} & MaxChatCompletionMessages;

export function convertChatCompletionMessagesFromSlack({
  slackMessages,
  maxMessagesCount = DEFAULT_MAX_CHAT_COMPLETION_MESSAGES_COUNT,
}: ConverterMessagesArgs): ChatCompletionRequestMessage[] {
  const maxCount = Number.isNaN(maxMessagesCount)
    ? DEFAULT_MAX_CHAT_COMPLETION_MESSAGES_COUNT
    : Number(maxMessagesCount);

  if (maxCount <= 0) {
    throw new Error('Max messages count must be greater than 0');
  }

  return [...slackMessages].splice(maxCount * -1, slackMessages.length).map(
    (message): ChatCompletionRequestMessage => ({
      role: message.bot_id ? 'assistant' : 'user',
      content: message.text || '',
      name: message.user,
    }),
  );
}
