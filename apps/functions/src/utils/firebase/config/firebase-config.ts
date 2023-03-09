import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs, OpenaiParameters, SlackParameters } from '@kkkaoru/slack-utils';

type AppConfig = {
  slack: { signing_secret: string } & Omit<SlackParameters, 'signingSecret'>;
  openai: { api_key: string } & Omit<OpenaiParameters, 'apiKey'>;
};

export function generateConfig(): CreateExpressReceiverArgs {
  const appConfig = config() as AppConfig;
  return {
    slack: {
      ...appConfig.slack,
      signingSecret: appConfig.slack.signing_secret,
    },
    openai: {
      ...appConfig.openai,
      apiKey: appConfig.openai.api_key,
    },
  };
}
