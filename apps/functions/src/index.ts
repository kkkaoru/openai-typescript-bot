import * as functions from 'firebase-functions';

import { createExpressReceiver } from './slack/app';
import { generateConfig } from './utils/config/firebase';
import { appLog, errorLog } from './utils';

const config = generateConfig();

const slackHandler = createExpressReceiver({
  signingSecret: config.slack.secret,
  token: config.slack.token,
  openAiApiKey: config.openai.api_key,
  appLog,
  errorLog,
});

export const slack = functions.region('asia-northeast1').https.onRequest(slackHandler.app);
