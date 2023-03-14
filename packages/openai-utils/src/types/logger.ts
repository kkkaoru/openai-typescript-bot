export type AppLogger = {
  appLog?: (args: unknown) => unknown;
  errorLog?: (args: unknown) => unknown;
};
