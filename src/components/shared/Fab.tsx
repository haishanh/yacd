import './rtf.css';

import * as React from 'react';
import { Action, Fab } from 'react-tiny-fab/dist';

import s from './Fab.module.css';

export function IsFetching({ children }: { children: React.ReactNode }) {
  return <span className={s.spining}>{children}</span>;
}

export const position = {
  right: 10,
  bottom: 10,
};

export { Fab, Action };
