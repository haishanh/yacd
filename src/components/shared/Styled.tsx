import * as React from 'react';

import s from './Styled.module.scss';

export function FlexCenter({ children }: { children: React.ReactNode }) {
  return <div className={s.FlexCenter}>{children}</div>;
}
