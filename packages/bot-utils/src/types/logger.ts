export type ExportLog = (args: unknown) => unknown;

export type Loggers = {
  appLog?: ExportLog;
  errorLog?: ExportLog;
};
