import { ExpressReceiver } from '@slack/bolt';
import { region } from 'firebase-functions';

export function createSlackRequestHandler(receiver: ExpressReceiver, regionName = 'asia-northeast1') {
  return region(regionName).https.onRequest(receiver.app);
}
