import type {App} from "@slack/bolt";
import {trimMentions, appLog, searchCache, fetchTextDavinci003, saveCache, errorLog} from "../../utils";

// Require app_mentions:read
export function setMentionEvent(app: App, openAiApiKey: string) {
  app.event("app_mention", async ({event, say}) => {
    const trimmedText = trimMentions(event.text);
    try {
      appLog("try fetch openai");
      const cacheMessage = searchCache(event.ts)?.message;
      const fetchedMessage = cacheMessage ?? (await fetchTextDavinci003({prompt: trimmedText, apiKey: openAiApiKey}).then((response) => {
        appLog(response);
        appLog("finished fetch openai");
        return response.choices[0].text;
      }));
      if (cacheMessage !== undefined) {
        appLog(`cache hit ${event.ts}`);
      }
      saveCache(event.ts, {message: fetchedMessage, said: false});
      appLog(fetchedMessage);
      appLog("try say slack");
      const cacheSaid = searchCache(event.ts)?.said;
      if (cacheSaid === true) {
        appLog(`said ${event.ts}`);
        return;
      }
      await say({thread_ts: event.ts, text: `<@${event.user}> ${fetchedMessage}`});
      saveCache(event.ts, {message: fetchedMessage, said: false});
      appLog("said slack");
    } catch (error) {
      errorLog(error);
      await say(`<@${event.user}> ${error?.toString()}`);
    }
  });
}
