import { App, ExpressReceiver } from '@slack/bolt';
import { setMentionEvent } from './events';

export function createExpressReceiver(signingSecret: string, token: string, openAiApiKey: string): ExpressReceiver {
  const expressReceiver = new ExpressReceiver({
    signingSecret,
    endpoints: '/events',
    processBeforeResponse: true,
  });

  const app = new App({
    receiver: expressReceiver,
    token,
  });

  setMentionEvent(app, openAiApiKey);
  return expressReceiver;
}
