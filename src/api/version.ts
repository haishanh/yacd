import { query, QueryCtx } from './fetch';

type VersionData = {
  version?: string;
  premium?: boolean;
};

export async function fetchVersion(ctx: QueryCtx): Promise<VersionData> {
  const json = (await query(ctx)) || {};
  return json;
}
