import type {App} from "@slack/bolt";
import {trimMentions, appLog, generateCacheKey, searchCache, fetchTextDavinci003, saveCache, errorLog} from "../../utils";

// Require app_mentions:read
export function setMentionEvent(app: App, openAiApiKey: string) {
  app.event("app_mention", async ({event, say}) => {
    const trimmedText = trimMentions(event.text);
    try {
      appLog("try fetch openai");
      const cacheKey = generateCacheKey(trimmedText);
      const cacheMessage = searchCache(cacheKey)?.message;
      const fetchedMessage = cacheMessage ?? (await fetchTextDavinci003({prompt: trimmedText, apiKey: openAiApiKey}).then((response) => {
        appLog(response);
        appLog("finished fetch openai");
        return response.choices[0].text;
      }));
      if (cacheMessage !== undefined) {
        appLog(`cache hit ${cacheKey}`);
      }
      saveCache(cacheKey, {message: fetchedMessage, said: false});
      appLog(fetchedMessage);
      appLog("try say slack");
      const cacheSaid = searchCache(cacheKey)?.said;
      if (cacheSaid === true) {
        appLog(`said ${cacheKey}`);
        return;
      }
      await say(`<@${event.user}> ${fetchedMessage}`);
      saveCache(cacheKey, {message: fetchedMessage, said: false});
      appLog("said slack");
    } catch (error) {
      errorLog(error);
      await say(`<@${event.user}> ${error?.toString()}`);
    }
  });
}
