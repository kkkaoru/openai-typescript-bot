import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs, OpenaiParameters, SlackParameters } from '@kkkaoru/slack-utils';

type AppConfig = {
  slack: { signing_secret: string } & Omit<SlackParameters, 'signingSecret'>;
  openai: { api_key: string; message_max_count?: string; enabled_system_content?: string } & Omit<
    OpenaiParameters,
    'apiKey' | 'messagesMaxCount' | 'enabledSystemContent'
  >;
};

export function generateConfig(): CreateExpressReceiverArgs {
  const appConfig = config() as AppConfig;
  const { api_key, message_max_count, enabled_system_content, ...openai } = appConfig.openai;
  const { signing_secret, ...slack } = appConfig.slack;

  return {
    slack: {
      ...slack,
      signingSecret: signing_secret,
    },
    openai: {
      ...openai,
      apiKey: api_key,
      maxMessagesCount: message_max_count,
      enabledSystemContent: enabled_system_content,
    },
  };
}
