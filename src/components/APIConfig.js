import React, { useState, useEffect, useRef } from 'react';
import { useComponentState, useActions } from 'm/store';

import Input from 'c/Input';
import Button from 'c/Button';

import s0 from './APIConfig.module.scss';

import { getClashAPIConfig, updateClashAPIConfig } from 'd/app';

const mapStateToProps = s => ({
  apiConfig: getClashAPIConfig(s)
});

function APIConfig2() {
  const { apiConfig } = useComponentState(mapStateToProps);
  const [hostname, setHostname] = useState(apiConfig.hostname);
  const [port, setPort] = useState(apiConfig.port);
  const [secret, setSecret] = useState(apiConfig.secret);
  const actions = useActions({ updateClashAPIConfig });

  const contentEl = useRef(null);
  useEffect(() => {
    contentEl.current.focus();
  }, []);

  const handleInputOnChange = e => {
    const target = e.target;
    const { name } = target;
    let value = target.value;
    switch (name) {
      case 'port':
        setPort(value);
        break;
      case 'hostname':
        setHostname(value);
        break;
      case 'secret':
        setSecret(value);
        break;
    }
  };

  function updateConfig() {
    actions.updateClashAPIConfig({ hostname, port, secret });
  }

  function handleContentOnKeyDown(e) {
    // enter keyCode is 13
    if (e.keyCode !== 13) return;
    updateConfig();
  }

  return (
    <div
      className={s0.root}
      ref={contentEl}
      tabIndex="1"
      onKeyDown={handleContentOnKeyDown}
    >
      <div className={s0.header}>Clash External Controller Config</div>
      <div className={s0.body}>
        <div className={s0.group}>
          <div className={s0.label}>Hostname and Port</div>
          <div className={s0.inputs}>
            <Input
              type="text"
              name="hostname"
              placeholder="Hostname"
              value={hostname}
              onChange={handleInputOnChange}
            />
            <Input
              type="number"
              name="port"
              placeholder="Port"
              value={port}
              onChange={handleInputOnChange}
            />
          </div>
        </div>
        <div className={s0.group}>
          <div className={s0.label}>Authorization Secret (Optional)</div>
          <div>
            <Input
              type="text"
              name="secret"
              value={secret}
              placeholder="Optional"
              onChange={handleInputOnChange}
            />
          </div>
        </div>
      </div>
      <div className={s0.footer}>
        <Button label="Confirm" onClick={updateConfig} />
      </div>
    </div>
  );
}

export default APIConfig2;
