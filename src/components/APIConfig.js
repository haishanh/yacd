import React, { useState, useEffect, useRef } from 'react';
import { useStoreState, useActions } from 'm/store';

import Field from 'c/Field';
import Button from 'c/Button';
import SvgYacd from './SvgYacd';

import s0 from './APIConfig.module.css';

import { getClashAPIConfig, updateClashAPIConfig } from 'd/app';

const mapStateToProps = s => ({
  apiConfig: getClashAPIConfig(s)
});

function APIConfig2() {
  const { apiConfig } = useStoreState(mapStateToProps);
  const [hostname, setHostname] = useState(apiConfig.hostname);
  const [port, setPort] = useState(apiConfig.port);
  const [secret, setSecret] = useState(apiConfig.secret);
  const actions = useActions({ updateClashAPIConfig });

  const contentEl = useRef(null);

  const detectApiServer = async () => {
    // if there is already a clash API server at `/`, just use it as default value
    const res = await fetch('/');
    res.json().then(data => {
      if (data['hello'] === 'clash') {
        setHostname(window.location.hostname);
        setPort(window.location.port);
      }
    });
  };

  useEffect(() => {
    contentEl.current.focus();
    detectApiServer();
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
      default:
        throw new Error(`unknown input name ${name}`);
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
    <div className={s0.root} ref={contentEl} onKeyDown={handleContentOnKeyDown}>
      <div className={s0.header}>
        <div className={s0.icon}>
          <SvgYacd width={160} height={160} />
        </div>
      </div>
      <div className={s0.body}>
        <div className={s0.hostnamePort}>
          <div>
            <Field
              id="hostname"
              name="hostname"
              label="Hostname"
              type="text"
              value={hostname}
              onChange={handleInputOnChange}
            />
          </div>
          <div>
            <Field
              id="port"
              name="port"
              label="Port"
              type="number"
              value={port}
              onChange={handleInputOnChange}
            />
          </div>
        </div>
        <div>
          <Field
            id="secret"
            name="secret"
            label="Secret(optional)"
            value={secret}
            type="text"
            onChange={handleInputOnChange}
          />
        </div>
      </div>
      <div className={s0.footer}>
        <Button label="Confirm" onClick={updateConfig} />
      </div>
    </div>
  );
}

export default APIConfig2;
