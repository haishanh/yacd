import { useAtom } from 'jotai';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ToggleInput } from '$src/components/form/Toggle';
import Select from '$src/components/shared/Select';
import { autoCloseOldConnsAtom, hideUnavailableProxiesAtom, proxySortByAtom } from '$src/store/app';

import s from './Settings.module.scss';

const options = [
  ['Natural', 'order_natural'],
  ['LatencyAsc', 'order_latency_asc'],
  ['LatencyDesc', 'order_latency_desc'],
  ['NameAsc', 'order_name_asc'],
  ['NameDesc', 'order_name_desc'],
];

const { useCallback } = React;

export default function Settings() {
  const [autoCloseOldConns, setAutoCloseOldConns] = useAtom(autoCloseOldConnsAtom);
  const [proxySortBy, setProxySortBy] = useAtom(proxySortByAtom);
  const [hideUnavailableProxies, setHideUnavailableProxies] = useAtom(hideUnavailableProxiesAtom);
  const handleProxySortByOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setProxySortBy(e.target.value),
    [setProxySortBy],
  );

  const handleHideUnavailablesSwitchOnChange = useCallback(
    (v: boolean) => {
      setHideUnavailableProxies(v);
    },
    [setHideUnavailableProxies],
  );
  const { t } = useTranslation();
  return (
    <>
      <div className={s.labeledInput}>
        <span>{t('sort_in_grp')}</span>
        <div>
          <Select
            options={options.map((o) => {
              return [o[0], t(o[1])];
            })}
            selected={proxySortBy}
            onChange={handleProxySortByOnChange}
          />
        </div>
      </div>
      <hr />
      <div className={s.labeledInput}>
        <label htmlFor="hideUnavailableProxies">{t('hide_unavail_proxies')}</label>
        <div>
          <ToggleInput
            id="hideUnavailableProxies"
            checked={hideUnavailableProxies}
            onChange={handleHideUnavailablesSwitchOnChange}
          />
        </div>
      </div>
      <div className={s.labeledInput}>
        <label htmlFor="autoCloseOldConns">{t('auto_close_conns')}</label>
        <div>
          <ToggleInput
            id="autoCloseOldConns"
            checked={autoCloseOldConns}
            onChange={setAutoCloseOldConns}
          />
        </div>
      </div>
    </>
  );
}
