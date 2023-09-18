import cx from 'clsx';
import * as React from 'react';
import { Eye, EyeOff, X as Close } from 'react-feather';
import { useToggle } from 'src/hooks/basic';
import { getClashAPIConfigs, getSelectedClashAPIConfigIndex } from 'src/store/app';
import { ClashAPIConfig } from 'src/types';

import { State } from '$src/store/types';

import s from './BackendList.module.scss';
import { connect, useStoreActions } from './StateProvider';

type Config = ClashAPIConfig & { addedAt: number };

const mapState = (s: State) => ({
  apiConfigs: getClashAPIConfigs(s),
  selectedClashAPIConfigIndex: getSelectedClashAPIConfigIndex(s),
});

export const BackendList = connect(mapState)(BackendListImpl);

function BackendListImpl({
  apiConfigs,
  selectedClashAPIConfigIndex,
}: {
  apiConfigs: Config[];
  selectedClashAPIConfigIndex: number;
}) {
  const {
    app: { removeClashAPIConfig, selectClashAPIConfig },
  } = useStoreActions();

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
