import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useComponentState, useActions } from 'm/store';

import { getConfigs, fetchConfigs, updateConfigs } from 'd/configs';

import ContentHeader from 'c/ContentHeader';
import Switch from 'c/Switch';
import ToggleSwitch from 'c/ToggleSwitch';
import Input from 'c/Input';
import s0 from 'c/Config.module.scss';

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

const actions = {
  fetchConfigs,
  updateConfigs
};

const mapStateToProps = s => ({ configs: getConfigs(s) });

export default function ConfigContainer() {
  const { fetchConfigs } = useActions(actions);
  const { configs } = useComponentState(mapStateToProps);
  useEffect(() => {
    fetchConfigs();
  }, []);
  return <Config configs={configs} />;
}

function Config({ configs }) {
  const { updateConfigs } = useActions(actions);
  // configState to track component internal state
  // prevConfigs to track external props.configs
  const [configState, _setConfigState] = useState(configs);
  const [prevConfigs, setPrevConfigs] = useState(configs);
  // equivalent of getDerivedStateFromProps
  if (prevConfigs !== configs) {
    setPrevConfigs(configs);
    _setConfigState(configs);
  }

  const setConfigState = (name, val) => {
    _setConfigState({
      ...configState,
      [name]: val
    });
  };

  function handleInputOnChange(e) {
    const target = e.target;
    const { name } = target;
    let { value } = target;
    switch (target.name) {
      case 'allow-lan':
        value = target.checked;
        setConfigState(name, value);
        updateConfigs({ [name]: value });
        break;
      case 'mode':
      case 'log-level':
        setConfigState(name, value);
        updateConfigs({ [name]: value });
        break;
      case 'redir-port':
      case 'socket-port':
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
  }

  function handleInputOnBlur(e) {
    const target = e.target;
    const { name, value } = target;
    switch (name) {
      case 'port':
      case 'socket-port':
      case 'redir-port': {
        const num = parseInt(value, 10);
        if (num < 0 || num > 65535) return;
        updateConfigs({ [name]: num });
        break;
      }
    }
  }

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
            name="socket-port"
            value={configState['socket-port']}
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
    </div>
  );
}

Config.propTypes = {
  configs: PropTypes.object
};
