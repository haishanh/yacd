import * as React from 'react';
import { fetchConfigs } from 'src/api/configs';
import { BackendList } from 'src/components/BackendList';
import { ClashAPIConfig } from 'src/types';

import { addClashAPIConfig, getClashAPIConfig } from '../store/app';
import s0 from './APIConfig.module.css';
import Button from './Button';
import Field from './Field';
import { connect } from './StateProvider';
import SvgYacd from './SvgYacd';

const { useState, useRef, useCallback } = React;
const Ok = 0;

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

function APIConfig({ dispatch }) {
  const [baseURL, setBaseURL] = useState('');
  const [secret, setSecret] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const userTouchedFlagRef = useRef(false);
  const contentEl = useRef(null);

  const handleInputOnChange = useCallback((e) => {
    userTouchedFlagRef.current = true;
    setErrMsg('');
    const target = e.target;
    const { name } = target;
    const value = target.value;
    switch (name) {
      case 'baseURL':
        setBaseURL(value);
        break;
      case 'secret':
        setSecret(value);
        break;
      default:
        throw new Error(`unknown input name ${name}`);
    }
  }, []);

  const onConfirm = useCallback(() => {
    verify({ baseURL, secret }).then((ret) => {
      if (ret[0] !== Ok) {
        setErrMsg(ret[1]);
      } else {
        dispatch(addClashAPIConfig({ baseURL, secret }));
      }
    });
  }, [baseURL, secret, dispatch]);

  const handleContentOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.target instanceof Element &&
        (!e.target.tagName || e.target.tagName.toUpperCase() !== 'INPUT')
      ) {
        return;
      }
      if (e.key !== 'Enter') return;

      onConfirm();
    },
    [onConfirm]
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={s0.root} ref={contentEl} onKeyDown={handleContentOnKeyDown}>
      <div className={s0.header}>
        <div className={s0.icon}>
          <SvgYacd width={160} height={160} />
        </div>
      </div>
      <div className={s0.body}>
        <div className={s0.hostnamePort}>
          <Field
            id="baseURL"
            name="baseURL"
            label="API Base URL"
            type="text"
            value={baseURL}
            onChange={handleInputOnChange}
          />
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
      <div className={s0.error}>{errMsg ? errMsg : null}</div>
      <div className={s0.footer}>
        <Button label="Add" onClick={onConfirm} />
      </div>
      <div style={{ height: 20 }} />
      <BackendList />
    </div>
  );
}

export default connect(mapState)(APIConfig);

async function verify(apiConfig: ClashAPIConfig): Promise<[number, string?]> {
  try {
    new URL(apiConfig.baseURL);
  } catch (e) {
    return [1, 'Invalid URL'];
  }
  try {
    const res = await fetchConfigs(apiConfig);
    if (res.status > 399) {
      return [1, res.statusText];
    }
    return [Ok];
  } catch (e) {
    return [1, 'Failed to connect'];
  }
}
