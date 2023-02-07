import * as functions from "firebase-functions";

import {createExpressReceiver} from "./slack/app";

const config = functions.config();
const slackHandler = createExpressReceiver(config.slack.secret, config.slack.token, config.openai.api_key);
export const slack = functions.region("asia-northeast1").https.onRequest(slackHandler.app);
