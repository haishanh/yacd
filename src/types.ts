export type ClashAPIConfig = {
  baseURL: string;
  secret?: string;
};

export type LogsAPIConfig = ClashAPIConfig & { logLevel: string };