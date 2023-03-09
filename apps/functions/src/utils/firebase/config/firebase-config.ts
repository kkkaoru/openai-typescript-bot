import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs, OpenaiParameters, SlackParameters } from '@kkkaoru/slack-utils';

type AppConfig = {
  slack: { signing_secret: string } & Omit<SlackParameters, 'signingSecret'>;
  openai: { api_key: string } & Omit<OpenaiParameters, 'apiKey'>;
};

export function generateConfig(): CreateExpressReceiverArgs {
  const appConfig = config() as AppConfig;
  const { api_key, ...openai } = appConfig.openai;
  const { signing_secret, ...slack } = appConfig.slack;
  return {
    slack: {
      ...slack,
      signingSecret: signing_secret,
    },
    openai: {
      ...openai,
      apiKey: api_key,
    },
  };
}
