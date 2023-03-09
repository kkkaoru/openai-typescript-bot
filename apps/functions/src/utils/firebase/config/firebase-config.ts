import { config } from 'firebase-functions';
import { CreateExpressReceiverArgs } from '@kkkaoru/slack-utils';

export function generateConfig(): CreateExpressReceiverArgs {
  return config() as CreateExpressReceiverArgs;
}
