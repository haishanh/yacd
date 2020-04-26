import * as React from 'react';

import { getProxySortBy, getHideUnavailableProxies } from '../../store/app';

import Switch from '../SwitchThemed';
import { connect, useStoreActions } from '../StateProvider';
import Select from '../shared/Select';
import s from './Settings.module.css';

const options = [
  ['Natural', 'Original order in config file'],
  ['LatencyAsc', 'By latency from small to big'],
  ['LatencyDesc', 'By latency from big to small'],
  ['NameAsc', 'By name alphabetically (A-Z)'],
  ['NameDesc', 'By name alphabetically (Z-A)'],
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
  return (
    <>
      <div className={s.labeledInput}>
        <span>Sorting in group</span>
        <div>
          <Select
            options={options}
            selected={appConfig.proxySortBy}
            onChange={handleProxySortByOnChange}
          />
        </div>
      </div>
      <hr />
      <div className={s.labeledInput}>
        <span>Hide unavailable proxies</span>
        <div>
          <Switch
            name="hideUnavailableProxies"
            checked={appConfig.hideUnavailableProxies}
            onChange={handleHideUnavailablesSwitchOnChange}
          />
        </div>
      </div>
    </>
  );
}

const mapState = (s) => {
  const proxySortBy = getProxySortBy(s);
  const hideUnavailableProxies = getHideUnavailableProxies(s);
  return {
    appConfig: {
      proxySortBy,
      hideUnavailableProxies,
    },
  };
};
export default connect(mapState)(Settings);
