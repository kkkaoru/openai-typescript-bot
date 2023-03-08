import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { ChatCompletionRequestMessage } from 'openai';

type ConverterMessagesArgs = {
  threadMessages: Message[];
  maxLength?: number;
};

export function convertChatCompletionMessages({
  threadMessages,
  maxLength = 18,
}: ConverterMessagesArgs): ChatCompletionRequestMessage[] {
  return [...threadMessages].splice(maxLength * -1, threadMessages.length).map(
    (message): ChatCompletionRequestMessage => ({
      role: message.bot_id ? 'assistant' : 'user',
      content: message.text || '',
      name: message.user,
    }),
  );
}
