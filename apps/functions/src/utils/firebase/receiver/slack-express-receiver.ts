import { createExpressReceiver } from '@kkkaoru/slack-utils';
import { appLog, errorLog } from '../logger';
import { generateConfig } from '../config';
import { ExpressReceiver } from '@slack/bolt';

export function createSlackExpressReceiver(): ExpressReceiver {
  const config = generateConfig();

  return createExpressReceiver({
    ...config,
    appLog,
    errorLog,
  });
}
