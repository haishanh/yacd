import React from 'react';

import s from './Basic.module.scss';

export function SectionNameType({ name, type }) {
  return (
    <h2 className={s.sectionNameType}>
      <span>{name}</span>
      <span>{type}</span>
    </h2>
  );
}

export function LoadingDot() {
  return <span className={s.loadingDot} />;
}
