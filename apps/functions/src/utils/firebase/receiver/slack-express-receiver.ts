import { createExpressReceiver } from '@kkkaoru/slack-utils';
import { ExpressReceiver } from '@slack/bolt';
import { appLog, errorLog } from '../logger';
import { generateConfig } from '../config';

export function createSlackExpressReceiver(): ExpressReceiver {
  const config = generateConfig();
  appLog(config);
  return createExpressReceiver({
    ...config,
    appLog,
    errorLog,
  });
}
