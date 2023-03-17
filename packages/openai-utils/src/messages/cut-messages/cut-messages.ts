import { ChatCompletionResponseMessage } from 'openai';

export function cutMessages(messages: ChatCompletionResponseMessage[], ratio = 2): ChatCompletionResponseMessage[] {
  if (messages.length <= 0) {
    return [];
  }
  return messages.slice(Math.floor(messages.length / ratio));
}
