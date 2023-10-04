import type { ClashAPIConfig } from 'src/types';

export type ThemeType = 'dark' | 'light' | 'auto';

export type StateApp = {
  selectedClashAPIConfigIndex: number;
  clashAPIConfigs: ClashAPIConfig[];

  latencyTestUrl: string;
  selectedChartStyleIndex: number;
  theme: ThemeType;

  collapsibleIsOpen: Record<string, boolean>;
  proxySortBy: string;
  hideUnavailableProxies: boolean;
  autoCloseOldConns: boolean;
  logStreamingPaused: boolean;
};

export type ClashGeneralConfig = {
  port: number;
  'socks-port': number;
  'redir-port': number;
  'allow-lan': boolean;
  mode: string;
  'log-level': string;
  // new
  authentication?: unknown[];
  'bind-address'?: string;
  ipv6?: boolean;
  'mixed-port'?: number;
  'tproxy-port'?: number;
};

///// store.proxies

type LatencyHistoryItem = { time: string; delay: number };
export type LatencyHistory = LatencyHistoryItem[];

export type ProxyItem = {
  name: string;
  type: string;
  history: LatencyHistory;
  all?: string[];
  now?: string;

  __provider?: string;
};

export type ProxyDelayItem =
  | { kind: 'Result'; number: number }
  | { kind: 'Testing' }
  | { kind: 'Error'; message: string }
  | { kind: 'None' };

export type ProxiesMapping = Record<string, ProxyItem>;
export type DelayMapping = Record<string, ProxyDelayItem>;

export type ProxyProvider = {
  name: string;
  type: 'Proxy';
  updatedAt: string;
  vehicleType: 'HTTP' | 'File' | 'Compatible';
  proxies: ProxyItem[];
};

export type FormattedProxyProvider = Omit<ProxyProvider, 'proxies'> & { proxies: string[] };

export type SwitchProxyCtxItem = { groupName: string; itemName: string };
type SwitchProxyCtx = { to: SwitchProxyCtxItem };

export type StateProxies = {
  groupNames: string[];
  proxyProviders?: FormattedProxyProvider[];

  proxies: ProxiesMapping;
  delay: DelayMapping;
  dangleProxyNames?: string[];

  showModalClosePrevConns: boolean;
  switchProxyCtx?: SwitchProxyCtx;
};

///// store.logs

export type Log = {
  time: string;
  even: boolean;
  payload: string;
  type: string;
  id: string;
};

export type StateLogs = {
  searchText: string;
  logs: Log[];
  tail: number;
};

//////

export type State = {
  proxies: StateProxies;
  logs: StateLogs;
};

export type GetStateFn = () => State;
export interface DispatchFn {
  (msg: string, change: (s: State) => void): void;
  (
    action: (dispatch: DispatchFn, getState: GetStateFn) => Promise<void>,
  ): ReturnType<typeof action>;
  (action: (dispatch: DispatchFn, getState: GetStateFn) => void): ReturnType<typeof action>;
}
