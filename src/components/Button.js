import React from 'react';
import cx from 'classnames';

import type { Node, Element, SyntheticEvent } from 'react';

import { LoadingDot } from './shared/Basic';

import s0 from './Button.module.css';

const { memo, forwardRef, useCallback } = React;

type ButtonProps = {
  children?: Node,
  label?: string,
  text?: string,
  isLoading?: boolean,
  start?: Element | (() => Element),
  onClick?: (SyntheticEvent<HTMLButtonElement>) => mixed,
  kind?: 'primary' | 'minimal'
};
function Button(props: ButtonProps, ref) {
  const { onClick, isLoading, kind = 'primary', ...restProps } = props;
  const internalOnClick = useCallback(
    e => {
      if (isLoading) return;
      onClick && onClick(e);
    },
    [isLoading, onClick]
  );
  const btnClassName = cx(s0.btn, {
    [s0.minimal]: kind === 'minimal'
  });
  return (
    <button className={btnClassName} ref={ref} onClick={internalOnClick}>
      {isLoading ? (
        <>
          <span
            style={{
              display: 'inline-flex',
              opacity: 0
            }}
          >
            <ButtonInternal {...restProps} />
          </span>
          <span className={s0.loadingContainer}>
            <LoadingDot />
          </span>
        </>
      ) : (
        <ButtonInternal {...restProps} />
      )}
    </button>
  );
}

function ButtonInternal({ children, label, text, start }) {
  return (
    <>
      {start ? (
        <span className={s0.btnStart}>
          {typeof start === 'function' ? start() : start}
        </span>
      ) : null}
      {children || label || text}
    </>
  );
}

export default memo(forwardRef(Button));
