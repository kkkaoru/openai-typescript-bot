import type {App} from "@slack/bolt";
import {trimMentions, appLog} from "../../utils";

// Require app_mentions:read
export function setMentionEvent(app: App) {
  app.event("app_mention", async ({event, say}) => {
    const trimmedText = trimMentions(event.text);
    try {
      appLog("try fetch openai");
      // const cacheKey = generateCacheKey(trimmedText);
      // const cacheFetchedData = searchCache(cacheKey)?.fetched;
      // const fetchedData = cacheFetchedData ?? (await fetchTextDavinci003(trimmedText));
      // saveCache(cacheKey, new SlackCache(fetchedData, false));
      // appLog(fetchedData);
      appLog("finished fetch openai");
      // const message = findChoicesText(fetchedData.choices);
      appLog("try say slack");
      // const cacheSaid = searchCache(cacheKey)?.said;
      // if (cacheSaid === true) {
      //   appLog(`said ${cacheKey}`);
      //   return;
      // }
      // await say(`<@${event.user}> ${message}`);
      await say(`<@${event.user}> ${trimmedText}`);
      // saveCache(cacheKey, new SlackCache(fetchedData, true));
      appLog("said slack");
    } catch (error) {
      await say(`<@${event.user}> Error: ${error?.toString()}`);
    }
  });
}
