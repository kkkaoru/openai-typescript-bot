import { createSlackRequestHandler } from './utils/firebase/handler/slack-request-handler';
import { createSlackExpressReceiver } from './utils/firebase/receiver/slack-express-receiver';

const slackReceiver = createSlackExpressReceiver();

export const slack = createSlackRequestHandler(slackReceiver);
