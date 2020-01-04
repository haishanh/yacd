import React from 'react';

import { connect } from './StateProvider';
import Field from './Field';
import Button from './Button';
import SvgYacd from './SvgYacd';

import s0 from './APIConfig.module.css';

import { getClashAPIConfig, updateClashAPIConfig } from '../store/app';

const { useState, useEffect, useRef, useCallback } = React;

const mapState = s => ({
  apiConfig: getClashAPIConfig(s)
});

function APIConfig({ apiConfig, dispatch }) {
  const [hostname, setHostname] = useState(apiConfig.hostname);
  const [port, setPort] = useState(apiConfig.port);
  const [secret, setSecret] = useState(apiConfig.secret);

  const userTouchedFlagRef = useRef(false);
  const contentEl = useRef(null);

  useEffect(() => {
    contentEl.current.focus();

    async function detectApiServer() {
      // API server probing
      // likely the current page url share the same base url with the API
      // server
      try {
        const res = await fetch('/');
        const data = await res.json();
        if (data.hello === 'clash' && userTouchedFlagRef.current === false) {
          const { hostname, port } = window.location;
          setHostname(hostname);
          setPort(port);
        }
      } catch (err) {
        // ignore
      }
    }

    detectApiServer();
  }, []);

  const handleInputOnChange = useCallback(e => {
    userTouchedFlagRef.current = true;
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
  }, []);

  const updateConfig = useCallback(() => {
    dispatch(updateClashAPIConfig({ hostname, port, secret }));
  }, [hostname, port, secret, dispatch]);

  const handleContentOnKeyDown = useCallback(
    e => {
      // enter keyCode is 13
      if (e.keyCode !== 13) return;
      updateConfig();
    },
    [updateConfig]
  );

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

export default connect(mapState)(APIConfig);
