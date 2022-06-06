import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'src/components/shared/Select';

import { getAutoCloseOldConns, getHideUnavailableProxies, getProxySortBy } from '../../store/app';
import { connect, useStoreActions } from '../StateProvider';
import Switch from '../SwitchThemed';
import s from './Settings.module.scss';

const options = [
  ['Natural', 'order_natural'],
  ['LatencyAsc', 'order_latency_asc'],
  ['LatencyDesc', 'order_latency_desc'],
  ['NameAsc', 'order_name_asc'],
  ['NameDesc', 'order_name_desc'],
];

const { useCallback } = React;

function Settings({ appConfig }) {
  const {
    app: { updateAppConfig },
  } = useStoreActions();

  const handleProxySortByOnChange = useCallback(
    (e) => {
      updateAppConfig('proxySortBy', e.target.value);
    },
    [updateAppConfig]
  );

  const handleHideUnavailablesSwitchOnChange = useCallback(
    (v) => {
      updateAppConfig('hideUnavailableProxies', v);
    },
    [updateAppConfig]
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
        <span>{t('hide_unavail_proxies')}</span>
        <div>
          <Switch
            name="hideUnavailableProxies"
            checked={appConfig.hideUnavailableProxies}
            onChange={handleHideUnavailablesSwitchOnChange}
          />
        </div>
      </div>
      <div className={s.labeledInput}>
        <span>{t('auto_close_conns')}</span>
        <div>
          <Switch
            name="autoCloseOldConns"
            checked={appConfig.autoCloseOldConns}
            onChange={(v) => updateAppConfig('autoCloseOldConns', v)}
          />
        </div>
      </div>
    </>
  );
}

const mapState = (s) => {
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
