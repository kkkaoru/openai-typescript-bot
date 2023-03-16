import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs, SlackParameters, OpenAiParamsWithoutApiKey } from '@kkkaoru/slack-utils';

type AppConfig = {
  app: {
    slack: { signing_secret: string } & Omit<SlackParameters, 'signingSecret'>;
    openai: { api_key: string; message_max_count?: string } & OpenAiParamsWithoutApiKey;
  };
};

export function generateConfig(): CreateExpressReceiverArgs {
  const { app } = config() as AppConfig;
  const { api_key, max_tokens, ...openai } = app.openai;
  const { signing_secret, ...slack } = app.slack;
  return {
    slack: {
      ...slack,
      signingSecret: signing_secret,
    },
    openai: {
      ...openai,
      apiKey: api_key,
      // max_tokens: Number(max_tokens),
    },
  };
}
