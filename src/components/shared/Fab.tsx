// adapted from https://github.com/dericgw/react-tiny-fab/blob/master/src/index.tsx
import './rtf.css';

import * as React from 'react';

import s from './Fab.module.scss';

const { useState } = React;

export function IsFetching({ children }: { children: React.ReactNode }) {
  return <span className={s.spining}>{children}</span>;
}

export const position = {
  right: 10,
  bottom: 10,
};

interface ABProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  onClick?: (e: React.FormEvent) => void;
  'data-testid'?: string;
}

const AB: React.FC<ABProps> = ({ children, ...p }) => (
  <button type="button" {...p} className="rtf--ab">
    {children}
  </button>
);

interface MBProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'tabIndex'> {
  tabIndex?: number;
}

export const MB: React.FC<MBProps> = ({ children, ...p }) => (
  <button type="button" className="rtf--mb" {...p}>
    {children}
  </button>
);

const defaultStyles: React.CSSProperties = { bottom: 24, right: 24 };

interface FabProps {
  event?: 'hover' | 'click';
  style?: React.CSSProperties;
  alwaysShowTitle?: boolean;
  icon?: React.ReactNode;
  mainButtonStyles?: React.CSSProperties;
  onClick?: (e: React.FormEvent) => void;
  text?: string;
  children?: React.ReactNode;
}

const Fab: React.FC<FabProps> = ({
  event = 'hover',
  style = defaultStyles,
  alwaysShowTitle = false,
  children,
  icon,
  mainButtonStyles,
  onClick,
  text,
  ...p
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ariaHidden = alwaysShowTitle || !isOpen;
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const enter = () => event === 'hover' && open();
  const leave = () => event === 'hover' && close();
  const toggle = (e: React.FormEvent) => {
    if (onClick) {
      return onClick(e);
    }
    e.persist();
    return event === 'click' ? (isOpen ? close() : open()) : null;
  };

  const actionOnClick = (e: React.FormEvent, userFunc: (e: React.FormEvent) => void) => {
    e.persist();
    setIsOpen(false);
    setTimeout(() => {
      userFunc(e);
    }, 1);
  };

  const rc = () =>
    React.Children.map(children, (ch, i) => {
      if (React.isValidElement<ABProps>(ch)) {
        return (
          <li className={`rtf--ab__c ${'top' in style ? 'top' : ''}`}>
            {React.cloneElement(ch, {
              'data-testid': `action-button-${i}`,
              'aria-label': ch.props.text || `Menu button ${i + 1}`,
              'aria-hidden': ariaHidden,
              tabIndex: isOpen ? 0 : -1,
              ...ch.props,
              onClick: (e: React.FormEvent) => {
                if (ch.props.onClick) actionOnClick(e, ch.props.onClick);
              },
            })}
            {ch.props.text && (
              <span
                className={`${'right' in style ? 'right' : ''} ${
                  alwaysShowTitle ? 'always-show' : ''
                }`}
                aria-hidden={ariaHidden}
              >
                {ch.props.text}
              </span>
            )}
          </li>
        );
      }
      return null;
    });

  return (
    <ul
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={`rtf ${isOpen ? 'open' : 'closed'}`}
      data-testid="fab"
      style={style}
      {...p}
    >
      <li className="rtf--mb__c">
        <MB
          onClick={toggle}
          style={mainButtonStyles}
          data-testid="main-button"
          role="button"
          aria-label="Floating menu"
          tabIndex={0}
        >
          {icon}
        </MB>
        {text && (
          <span
            className={`${'right' in style ? 'right' : ''} ${alwaysShowTitle ? 'always-show' : ''}`}
            aria-hidden={ariaHidden}
          >
            {text}
          </span>
        )}
        <ul>{rc()}</ul>
      </li>
    </ul>
  );
};

export { Fab, AB as Action };
