import {App, ExpressReceiver} from "@slack/bolt";
import {setMentionEvent} from "./events";

export function createExpressReceiver(secret: string, token: string ): ExpressReceiver {
  const expressReceiver = new ExpressReceiver({
    signingSecret: secret,
    endpoints: "/events",
    processBeforeResponse: true,
  });

  const app = new App({
    receiver: expressReceiver,
    token: token,
  });

  setMentionEvent(app);
  return expressReceiver;
}
