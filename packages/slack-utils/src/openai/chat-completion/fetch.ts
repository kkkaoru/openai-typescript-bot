import { ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import { createOpenAIClient } from '../openai-client/create-openai-client';
import { CHAT_COMPLETION_SYSTEM_CONTENT } from './system-content';

type FetchChatCompletionArgs = {
  model?: string;
  userContent: string;
  userName?: string;
} & ConfigurationParameters &
  Pick<CreateChatCompletionRequest, 'max_tokens' | 'temperature' | 'messages'>;

export async function fetchChatCompletion({
  apiKey,
  model = 'gpt-3.5-turbo',
  max_tokens = 4096,
  temperature = 0.8,
  messages,
  userContent,
  userName,
}: FetchChatCompletionArgs): Promise<string | undefined> {
  const client = createOpenAIClient({ apiKey });
  const result = await client.createChatCompletion({
    model,
    max_tokens,
    temperature,
    messages: [
      {
        role: 'system',
        content: CHAT_COMPLETION_SYSTEM_CONTENT,
      },
      ...messages,
      {
        role: 'user',
        content: userContent,
        name: userName,
      },
    ],
  });
  return result.data.choices[0].message?.content;
}
