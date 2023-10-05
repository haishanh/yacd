import { useAtom } from 'jotai';
import * as React from 'react';

import { fetchConfigs } from '$src/api/configs';
import Field from '$src/components//Field';
import Button from '$src/components/Button';
import SvgYacd from '$src/components/SvgYacd';
import { clashAPIConfigsAtom, findClashAPIConfigIndex } from '$src/store/app';
import { ClashAPIConfig } from '$src/types';

import s0 from './BackendForm.module.scss';

const { useState, useRef, useCallback } = React;
const Ok = 0;

export function BackendForm() {
  const [baseURL, setBaseURL] = useState('');
  const [secret, setSecret] = useState('');
  const [metaLabel, setMetaLabel] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const userTouchedFlagRef = useRef(false);

  const handleInputOnChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
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
      case 'metaLabel':
        setMetaLabel(value);
        break;
      default:
        throw new Error(`unknown input name ${name}`);
    }
  }, []);
  const [apiConfigs, setApiConfigs] = useAtom(clashAPIConfigsAtom);
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      verify({ baseURL, secret }).then((ret) => {
        if (ret[0] !== Ok) {
          setErrMsg(ret[1]);
        } else {
          const conf = { baseURL, secret, metaLabel };
          const idx = findClashAPIConfigIndex(apiConfigs, conf);
          // already exists
          if (idx) return;
          setApiConfigs((apiConfigs) => {
            return [...apiConfigs, { ...conf, addedAt: Date.now() }];
          });
        }
      });
    },
    [apiConfigs, baseURL, metaLabel, secret, setApiConfigs],
  );

  return (
    <div>
      <div className={s0.header}>
        <div className={s0.icon}>
          <SvgYacd
            width={140}
            height={140}
            c0="transparent"
            eye="transparent"
            shapeStroke="var(--stroke)"
            mouth="var(--stroke)"
            eyeStroke="var(--stroke)"
          />
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <div className={s0.body}>
          <div className={s0.hostnamePort}>
            <Field
              id="baseURL"
              name="baseURL"
              label="API Base URL"
              type="text"
              placeholder="http://127.0.0.1:9090"
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
          {errMsg ? <div className={s0.error}>{errMsg}</div> : null}
          <div className={s0.label}>
            <Field
              id="metaLabel"
              name="metaLabel"
              label="Label(optional)"
              type="text"
              placeholder=""
              value={metaLabel}
              onChange={handleInputOnChange}
            />
          </div>
        </div>
        <div className={s0.footer}>
          <Button label="Add" />
        </div>
      </form>
    </div>
  );
}

async function verify(apiConfig: ClashAPIConfig): Promise<[number, string?]> {
  try {
    new URL(apiConfig.baseURL);
  } catch (e) {
    if (apiConfig.baseURL) {
      const prefix = apiConfig.baseURL.substring(0, 7);
      if (prefix !== 'http://' && prefix !== 'https:/') {
        return [1, 'Must starts with http:// or https://'];
      }
    }

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
