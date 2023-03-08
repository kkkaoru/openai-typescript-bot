import { logger } from 'firebase-functions';

export function appLog(args: unknown) {
  logger.info(args, { structuredData: true });
}

export function errorLog(args: unknown) {
  logger.error(args, { structuredData: true });
}
