import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'src/components/shared/Select';

import { ToggleInput } from '$src/components/form/Toggle';
import { State, StateApp } from '$src/store/types';

import { getAutoCloseOldConns, getHideUnavailableProxies, getProxySortBy } from '../../store/app';
import { connect, useStoreActions } from '../StateProvider';
import s from './Settings.module.scss';

const options = [
  ['Natural', 'order_natural'],
  ['LatencyAsc', 'order_latency_asc'],
  ['LatencyDesc', 'order_latency_desc'],
  ['NameAsc', 'order_name_asc'],
  ['NameDesc', 'order_name_desc'],
];

const { useCallback } = React;

function Settings({ appConfig }: { appConfig: StateApp }) {
  const {
    app: { updateAppConfig },
  } = useStoreActions();

  const handleProxySortByOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateAppConfig('proxySortBy', e.target.value);
    },
    [updateAppConfig],
  );

  const handleHideUnavailablesSwitchOnChange = useCallback(
    (v: boolean) => {
      updateAppConfig('hideUnavailableProxies', v);
    },
    [updateAppConfig],
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
            selected={appConfig.proxySortBy}
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
            checked={appConfig.hideUnavailableProxies}
            onChange={handleHideUnavailablesSwitchOnChange}
          />
        </div>
      </div>
      <div className={s.labeledInput}>
        <label htmlFor="autoCloseOldConns">{t('auto_close_conns')}</label>
        <div>
          <ToggleInput
            id="autoCloseOldConns"
            checked={appConfig.autoCloseOldConns}
            onChange={(v: boolean) => updateAppConfig('autoCloseOldConns', v)}
          />
        </div>
      </div>
    </>
  );
}

const mapState = (s: State) => {
  const proxySortBy = getProxySortBy(s);
  const hideUnavailableProxies = getHideUnavailableProxies(s);
  const autoCloseOldConns = getAutoCloseOldConns(s);

  return {
    appConfig: {
      proxySortBy,
      hideUnavailableProxies,
      autoCloseOldConns,
    },
  };
};
export default connect(mapState)(Settings);
