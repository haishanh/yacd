import React, { useEffect } from 'react';
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
  }
];

const actions = {
  fetchConfigs,
  updateConfigs
};

const mapStateToProps = s => ({ configs: getConfigs(s) });

export default function Config2() {
  const { fetchConfigs, updateConfigs } = useActions(actions);
  const { configs } = useComponentState(mapStateToProps);
  useEffect(() => {
    fetchConfigs();
  }, []);

  function handleInputOnChange(ev) {
    const target = ev.target;
    const { name } = target;

    let value;
    switch (target.type) {
      case 'checkbox':
        value = target.checked;
        break;
      case 'number':
        value = Number(target.value);
        break;
      default:
        value = target.value;
    }
    if (configs[name] === value) return;
    updateConfigs({ [name]: value });
  }

  return (
    <div>
      <ContentHeader title="Config" />
      <div className={s0.root}>
        <div>
          <div className={s0.label}>HTTP Proxy Port</div>
          <Input
            name="port"
            value={configs.port}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>SOCKS5 Proxy Port</div>
          <Input
            name="socket-port"
            value={configs['socket-port']}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Redir Port</div>
          <Input
            name="redir-port"
            value={configs['redir-port']}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Allow LAN</div>
          <Switch
            name="allow-lan"
            checked={configs['allow-lan']}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Mode</div>
          <ToggleSwitch
            options={optionsRule}
            name="mode"
            value={configs.mode}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Log Level</div>
          <ToggleSwitch
            options={optionsLogLevel}
            name="log-level"
            value={configs['log-level']}
            onChange={handleInputOnChange}
          />
        </div>
      </div>
    </div>
  );
}
