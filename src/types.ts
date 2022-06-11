export type ClashAPIConfig = {
  baseURL: string;
  secret?: string;
};

export type LogsAPIConfig = ClashAPIConfig & { logLevel: string };

export type RuleType = { id?: number; type?: string; payload?: string; proxy?: string };
