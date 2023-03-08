import { config } from 'firebase-functions';

type ConfigSlack = {
  secret: string;
  token: string;
};

type ConfigOpenAI = {
  api_key: string;
};

type AppConfig = {
  slack: ConfigSlack;
  openai: ConfigOpenAI;
};

// const config = functions.config();
// const slackHandler = createExpressReceiver(config.slack.secret, config.slack.token, config.openai.api_key);
export function generateConfig(): AppConfig {
  return config() as AppConfig;
}
