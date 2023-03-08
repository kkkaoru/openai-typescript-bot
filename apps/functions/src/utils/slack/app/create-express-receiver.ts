import { App, ExpressReceiver } from '@slack/bolt';
import { setMentionEvent, SetMentionEventArgs } from '../events';

type CreateExpressReceiverArgs = {
  signingSecret: string;
  token: string;
} & Omit<SetMentionEventArgs, 'app'>;

export function createExpressReceiver({ signingSecret, token, ...args }: CreateExpressReceiverArgs): ExpressReceiver {
  const expressReceiver = new ExpressReceiver({
    signingSecret,
    endpoints: '/events',
    processBeforeResponse: true,
  });

  const app = new App({
    receiver: expressReceiver,
    token,
  });

  setMentionEvent({ ...args, app });
  return expressReceiver;
}
