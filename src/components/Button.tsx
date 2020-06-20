import cx from 'clsx';
import * as React from 'react';

import s0 from './Button.module.css';
import { LoadingDot } from './shared/Basic';

const { memo, forwardRef, useCallback } = React;

type ButtonInternalProps = {
  children?: React.ReactNode;
  label?: string;
  text?: string;
  start?: React.ReactElement | (() => React.ReactElement);
};

type ButtonProps = {
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
  kind?: 'primary' | 'minimal';
  className?: string;
} & ButtonInternalProps;

function Button(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const {
    onClick,
    isLoading,
    kind = 'primary',
    className,
    ...restProps
  } = props;
  const internalOnClick = useCallback(
    (e) => {
      if (isLoading) return;
      onClick && onClick(e);
    },
    [isLoading, onClick]
  );
  const btnClassName = cx(
    s0.btn,
    {
      [s0.minimal]: kind === 'minimal',
    },
    className
  );
  return (
    <button className={btnClassName} ref={ref} onClick={internalOnClick}>
      {isLoading ? (
        <>
          <span
            style={{
              display: 'inline-flex',
              opacity: 0,
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

function ButtonInternal({ children, label, text, start }: ButtonInternalProps) {
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
