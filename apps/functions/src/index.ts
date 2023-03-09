import * as functions from 'firebase-functions';

import { createExpressReceiver } from '@kkkaoru/slack-utils';
import { appLog, errorLog, generateConfig } from './utils';

const config = generateConfig();

const slackHandler = createExpressReceiver({
  ...config,
  appLog,
  errorLog,
});

export const slack = functions.region('asia-northeast1').https.onRequest(slackHandler.app);
