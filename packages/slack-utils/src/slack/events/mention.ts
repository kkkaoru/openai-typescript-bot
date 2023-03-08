import type { App } from '@slack/bolt';
import { fetchChatCompletion } from '../../openai/chat-completion';
import { convertChatCompletionMessages } from '../../openai/chat-completion/convert-messages';
import { fetchThreadMessagesIfCan } from '../fetch/fetch-thred';
import { trimMentions } from '../trim';

export type SetMentionEventArgs = {
  app: App;
  openAiApiKey: string;
  appLog?: (args: unknown) => unknown;
  errorLog?: (args: unknown) => unknown;
};

// Require app_mentions:read
export function setMentionEvent({ app, openAiApiKey, appLog, errorLog }: SetMentionEventArgs) {
  app.event('app_mention', async ({ event, say, context, client }) => {
    appLog?.(event);
    appLog?.(context);
    const trimmedText = trimMentions(event.text);
    if (context.retryNum !== undefined) {
      // If when retry, not say
      appLog?.('not say');
      return;
    }
    try {
      appLog?.('try fetch thread messages');
      const threadMessages = await fetchThreadMessagesIfCan({
        client,
        channel: event.channel,
        thread_ts: event.thread_ts,
      });
      appLog?.(threadMessages);
      const messages = convertChatCompletionMessages({ threadMessages });
      // Fetch OpenAI
      appLog?.('try fetch openai');
      appLog?.(trimmedText);
      const messageFromBot = await fetchChatCompletion({
        messages,
        apiKey: openAiApiKey,
        userContent: trimmedText,
        userName: event.user,
      });
      // Say Slack
      appLog?.('try say slack');
      const sayArgs = { thread_ts: event.ts, text: messageFromBot };
      await say(sayArgs).then(() => {
        appLog?.(sayArgs);
      });
    } catch (error) {
      errorLog?.(error);
      await say(`${error?.toString()}`);
    }
  });
}
