import {logger} from "firebase-functions";

export function appLog(args: unknown) {
  logger.info(args, {structuredData: true});
}
