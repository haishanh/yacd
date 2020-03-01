import React from 'react';
import PropTypes from 'prop-types';

import { connect, useStoreActions } from './StateProvider';
import { getConfigs, fetchConfigs, updateConfigs } from '../store/configs';
import {
  getClashAPIConfig,
  getSelectedChartStyleIndex,
  getLatencyTestUrl,
  clearStorage
} from '../store/app';

import ContentHeader from './ContentHeader';
import Switch from './SwitchThemed';
import ToggleSwitch from './ToggleSwitch';
import Input, { SelfControlledInput } from './Input';
import Button from './Button';
import Selection from './Selection';
import TrafficChartSample from './TrafficChartSample';

import s0 from './Config.module.css';

const { useEffect, useState, useCallback, useRef } = React;

const propsList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const optionsRule = [
  {
    label: 'Global',
    value: 'Global'
  },
  {
    label: 'Rule',
    value: 'Rule'
  },
  {
    label: 'Direct',
    value: 'Direct'
  }
];

const optionsLogLevel = [
  {
    label: 'info',
    value: 'info'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'error',
    value: 'error'
  },
  {
    label: 'debug',
    value: 'debug'
  },
  {
    label: 'silent',
    value: 'silent'
  }
];

const mapState = s => ({
  configs: getConfigs(s),
  apiConfig: getClashAPIConfig(s)
});

const mapState2 = s => ({
  selectedChartStyleIndex: getSelectedChartStyleIndex(s),
  latencyTestUrl: getLatencyTestUrl(s),
  apiConfig: getClashAPIConfig(s)
});

const Config = connect(mapState2)(ConfigImpl);
export default connect(mapState)(ConfigContainer);

function ConfigContainer({ dispatch, configs, apiConfig }) {
  useEffect(() => {
    dispatch(fetchConfigs(apiConfig));
  }, [dispatch, apiConfig]);
  return <Config configs={configs} />;
}

function ConfigImpl({
  dispatch,
  configs,
  selectedChartStyleIndex,
  latencyTestUrl,
  apiConfig
}) {
  const [configState, setConfigStateInternal] = useState(configs);
  const refConfigs = useRef(configs);
  useEffect(() => {
    if (refConfigs.current !== configs) {
      setConfigStateInternal(configs);
    }
    refConfigs.current = configs;
  }, [configs]);

  const setConfigState = useCallback(
    (name, val) => {
      setConfigStateInternal({
        ...configState,
        [name]: val
      });
    },
    [configState]
  );

  const handleInputOnChange = useCallback(
    e => {
      const target = e.target;
      const { name } = target;
      let { value } = target;
      switch (target.name) {
        case 'allow-lan':
          value = target.checked;
          setConfigState(name, value);
          dispatch(updateConfigs(apiConfig, { [name]: value }));
          break;
        case 'mode':
        case 'log-level':
          setConfigState(name, value);
          dispatch(updateConfigs(apiConfig, { [name]: value }));
          break;
        case 'redir-port':
        case 'socks-port':
        case 'port':
          if (target.value !== '') {
            const num = parseInt(target.value, 10);
            if (num < 0 || num > 65535) return;
          }
          setConfigState(name, value);
          break;
        default:
          return;
      }
    },
    [apiConfig, dispatch, setConfigState]
  );

  const { selectChartStyleIndex, updateAppConfig } = useStoreActions();

  const handleInputOnBlur = useCallback(
    e => {
      const target = e.target;
      const { name, value } = target;
      switch (name) {
        case 'port':
        case 'socks-port':
        case 'redir-port': {
          const num = parseInt(value, 10);
          if (num < 0 || num > 65535) return;
          dispatch(updateConfigs(apiConfig, { [name]: num }));
          break;
        }
        case 'latencyTestUrl': {
          updateAppConfig(name, value);
          break;
        }
        default:
          throw new Error(`unknown input name ${name}`);
      }
    },
    [apiConfig, dispatch, updateAppConfig]
  );

  return (
    <div>
      <ContentHeader title="Config" />
      <div className={s0.root}>
        <div>
          <div className={s0.label}>HTTP Proxy Port</div>
          <Input
            name="port"
            value={configState.port}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>SOCKS5 Proxy Port</div>
          <Input
            name="socks-port"
            value={configState['socks-port']}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>Redir Port</div>
          <Input
            name="redir-port"
            value={configState['redir-port']}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>Allow LAN</div>
          <Switch
            name="allow-lan"
            checked={configState['allow-lan']}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Mode</div>
          <ToggleSwitch
            options={optionsRule}
            name="mode"
            value={configState.mode}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Log Level</div>
          <ToggleSwitch
            options={optionsLogLevel}
            name="log-level"
            value={configState['log-level']}
            onChange={handleInputOnChange}
          />
        </div>
      </div>

      <div className={s0.sep}>
        <div />
      </div>

      <div className={s0.section}>
        <div>
          <div className={s0.label}>Chart Style</div>
          <Selection
            OptionComponent={TrafficChartSample}
            optionPropsList={propsList}
            selectedIndex={selectedChartStyleIndex}
            onChange={selectChartStyleIndex}
          />
        </div>
        <div style={{ maxWidth: 360 }}>
          <div className={s0.label}>Latency Test URL</div>
          <SelfControlledInput
            name="latencyTestUrl"
            type="text"
            value={latencyTestUrl}
            onBlur={handleInputOnBlur}
          />
        </div>
        <div>
          <div className={s0.label}>Action</div>
          <Button label="Log out" onClick={clearStorage} />
        </div>
      </div>
    </div>
  );
}

Config.propTypes = {
  configs: PropTypes.object
};
