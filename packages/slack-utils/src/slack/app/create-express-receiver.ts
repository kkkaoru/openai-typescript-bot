import { App, AppOptions, ExpressReceiver, ExpressReceiverOptions } from '@slack/bolt';
import { setMentionEvent, SetMentionEventArgs } from '../events';

export type SlackParameters = Pick<ExpressReceiverOptions, 'signingSecret'> & Pick<AppOptions, 'token'>;

export type CreateExpressReceiverArgs = {
  slack: SlackParameters;
} & Omit<SetMentionEventArgs, 'app'>;

export function createExpressReceiver({ slack, ...args }: CreateExpressReceiverArgs): ExpressReceiver {
  args.appLog?.('Creating ExpressReceiver...');
  args.appLog?.(slack);
  const { signingSecret, token } = slack;
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
