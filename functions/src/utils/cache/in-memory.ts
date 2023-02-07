import {createHash} from "crypto";
import NodeCache from "node-cache";

type SlackCache = {
  message: string | undefined;
  said: boolean;
}

const botCache = new NodeCache();

export function generateCacheKey(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

export function saveCache(cacheKey: string, slackCache: SlackCache) {
  if (slackCache.message === undefined) {
    return;
  }
  botCache.set(cacheKey, slackCache);
}

export function searchCache(cacheKey: string): SlackCache | undefined {
  return botCache.get(cacheKey);
}
