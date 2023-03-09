import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs } from '@kkkaoru/slack-utils';

type ConfigSlack = {
  secret: string;
  token: string;
};

type ConfigOpenAI = {
  api_key: string;
  max_tokens?: string;
};

type AppConfig = {
  slack: ConfigSlack;
  openai: ConfigOpenAI;
};

export function generateConfig(): CreateExpressReceiverArgs {
  const configs = config() as AppConfig;
  return {
    signingSecret: configs.slack.secret,
    token: configs.slack.token,
    openAiApiKey: configs.openai.api_key,
    max_tokens: Number.isNaN(Number(configs.openai?.max_tokens)) ? undefined : Number(configs.openai?.max_tokens),
  };
}
