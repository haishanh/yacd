export type ClashAPIConfig = {
  baseURL: string;
  secret?: string;

  // metadata
  metaLabel?: string;
  addedAt?: number;
};

export type LogsAPIConfig = ClashAPIConfig & { logLevel: string };

export type RuleType = { id?: number; type?: string; payload?: string; proxy?: string };

export type FetchCtx = {
  endpoint: string;
  apiConfig: ClashAPIConfig;
};
