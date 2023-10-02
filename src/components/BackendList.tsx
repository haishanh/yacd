import cx from 'clsx';
import { useAtom } from 'jotai';
import * as React from 'react';
import { Eye, EyeOff, X as Close } from 'react-feather';

import { useToggle } from '$src/hooks/basic';
import { saveStateTmp } from '$src/misc/storage';
import {
  clashAPIConfigsAtom,
  findClashAPIConfigIndexTmp,
  selectedClashAPIConfigIndexAtom,
} from '$src/store/app';
import { ClashAPIConfig } from '$src/types';

import s from './BackendList.module.scss';

export function BackendList() {
  const [apiConfigs, setApiConfigs] = useAtom(clashAPIConfigsAtom);
  const [selectedClashAPIConfigIndex, setSelectedClashAPIConfigIndex] = useAtom(
    selectedClashAPIConfigIndexAtom,
  );
  const removeClashAPIConfig = React.useCallback(
    (conf: ClashAPIConfig) => {
      const idx = findClashAPIConfigIndexTmp(apiConfigs, conf);
      setApiConfigs(apiConfigs => {
        apiConfigs.splice(idx, 1);
        return [...apiConfigs];
      });
      if (idx === selectedClashAPIConfigIndex) {
        setSelectedClashAPIConfigIndex(0);
      } else if (idx < selectedClashAPIConfigIndex) {
        setSelectedClashAPIConfigIndex(selectedClashAPIConfigIndex - 1);
      }
    },
    [apiConfigs, selectedClashAPIConfigIndex, setApiConfigs, setSelectedClashAPIConfigIndex],
  );

  React.useEffect(() => {
    saveStateTmp({
      selectedClashAPIConfigIndex,
      clashAPIConfigs: apiConfigs,
    });
  }, [apiConfigs, selectedClashAPIConfigIndex]);

  const selectClashAPIConfig = React.useCallback(
    (conf: ClashAPIConfig) => {
      const idx = findClashAPIConfigIndexTmp(apiConfigs, conf);
      const curr = selectedClashAPIConfigIndex;
      if (curr !== idx) {
        setSelectedClashAPIConfigIndex(idx);
      }
      saveStateTmp({ selectedClashAPIConfigIndex });

      // manual clean up is too complex
      // we just reload the app
      try {
        window.location.reload();
      } catch (err) {
        // ignore
      }

    },
    [apiConfigs, selectedClashAPIConfigIndex, setSelectedClashAPIConfigIndex],
  );

  // const {
  //   app: { selectClashAPIConfig },
  // } = useStoreActions();

  const onRemove = React.useCallback(
    (conf: ClashAPIConfig) => {
      removeClashAPIConfig(conf);
    },
    [removeClashAPIConfig],
  );
  const onSelect = React.useCallback(
    (conf: ClashAPIConfig) => {
      selectClashAPIConfig(conf);
    },
    [selectClashAPIConfig],
  );

  return (
    <>
      <ul className={s.ul}>
        {apiConfigs.map((item, idx) => {
          return (
            <li
              className={cx(s.li, { [s.isSelected]: idx === selectedClashAPIConfigIndex })}
              key={item.baseURL + item.secret + item.metaLabel}
            >
              <Item
                disableRemove={idx === selectedClashAPIConfigIndex}
                conf={item}
                onRemove={onRemove}
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
      <Button disabled={disableRemove} onClick={() => onRemove(conf)} className={s.close}>
        <Close size={20} />
      </Button>

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
