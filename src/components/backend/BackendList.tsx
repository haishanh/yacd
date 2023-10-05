import cx from 'clsx';
import { useAtom } from 'jotai';
import * as React from 'react';
import { Eye, EyeOff, X as Close } from 'react-feather';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { req } from '$src/api/fetch';
import { useToggle } from '$src/hooks/basic';
import { getURLAndInit } from '$src/misc/request-helper';
import { sleep } from '$src/misc/utils';
import {
  clashAPIConfigsAtom,
  findClashAPIConfigIndex,
  selectedClashAPIConfigIndexAtom,
} from '$src/store/app';
import { ClashAPIConfig } from '$src/types';

import s from './BackendList.module.scss';

export function BackendList() {
  const navigate = useNavigate();
  const [apiConfigs, setApiConfigs] = useAtom(clashAPIConfigsAtom);
  const [currIdx, setCurrIdx] = useAtom(selectedClashAPIConfigIndexAtom);

  const removeClashAPIConfig = React.useCallback(
    (conf: ClashAPIConfig) => {
      const idx = findClashAPIConfigIndex(apiConfigs, conf);
      setApiConfigs((apiConfigs) => {
        apiConfigs.splice(idx, 1);
        return [...apiConfigs];
      });
      if (idx === currIdx) {
        setCurrIdx(0);
      } else if (idx < currIdx) {
        setCurrIdx(currIdx - 1);
      }
    },
    [apiConfigs, currIdx, setApiConfigs, setCurrIdx],
  );

  const onSelect = React.useCallback(
    async (conf: ClashAPIConfig) => {
      const idx = findClashAPIConfigIndex(apiConfigs, conf);
      const { url, init } = getURLAndInit(apiConfigs[idx]);
      let res: Response;
      try {
        res = await req(url, init);
      } catch (err) {
        console.log(err);
        toast.error('Failed to connect');
        return;
      }
      let data: { hello: unknown };
      try {
        data = await res.json();
      } catch (err) {
        console.log(err);
        toast.error('Unexpected response');
        return;
      }
      if (typeof data['hello'] !== 'string') {
        console.log('Response:', data);
        toast.error('Unexpected response');
        return;
      }
      if (currIdx === idx) {
        navigate('/', { replace: true });
      } else {
        setCurrIdx(idx);
        await sleep(32);
        // manual clean up is too complex
        // we just reload the app
        try {
          window.location.href = '/';
        } catch (err) {
          // ignore
        }
      }
    },
    [apiConfigs, currIdx, setCurrIdx, navigate],
  );

  return (
    <>
      <ul className={s.ul}>
        {apiConfigs.map((item, idx) => {
          return (
            <li
              className={cx(s.li, { [s.isSelected]: idx === currIdx })}
              key={item.baseURL + item.secret + item.metaLabel}
            >
              <Item
                disableRemove={idx === currIdx}
                conf={item}
                onRemove={removeClashAPIConfig}
                onSelect={onSelect}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Item({
  conf,
  disableRemove,
  onRemove,
  onSelect,
}: {
  conf: ClashAPIConfig;
  disableRemove: boolean;
  onRemove: (x: ClashAPIConfig) => void;
  onSelect: (x: ClashAPIConfig) => void;
}) {
  const [show, toggle] = useToggle();
  const Icon = show ? EyeOff : Eye;

  const handleTap = React.useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {disableRemove ? (
        <span />
      ) : (
        <Button disabled={disableRemove} onClick={() => onRemove(conf)} className={s.close}>
          <Close size={20} />
        </Button>
      )}

      <div className={s.right}>
        {conf.metaLabel ? (
          <>
            <span
              className={s.metaLabel}
              tabIndex={0}
              role="button"
              onClick={() => onSelect(conf)}
              onKeyUp={handleTap}
            >
              {conf.metaLabel}
            </span>
            <span />
          </>
        ) : null}
        <span
          className={s.url}
          tabIndex={0}
          role="button"
          onClick={() => onSelect(conf)}
          onKeyUp={handleTap}
        >
          {conf.baseURL}
        </span>
        <span />
        {conf.secret ? (
          <>
            <span className={s.secret}>{show ? conf.secret : '***'}</span>
            <Button onClick={toggle} className={s.eye}>
              <Icon size={16} />
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
}

function Button({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
  className: string;
  disabled?: boolean;
}) {
  return (
    <button disabled={disabled} className={cx(className, s.btn)} onClick={onClick}>
      {children}
    </button>
  );
}
