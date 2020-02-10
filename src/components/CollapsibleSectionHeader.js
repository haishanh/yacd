import React from 'react';
import { ChevronDown } from 'react-feather';
import cx from 'classnames';

import { SectionNameType } from './shared/Basic';
import Button from './Button';

import s from './CollapsibleSectionHeader.module.css';

type Props = {
  name: string,
  type: string,
  qty?: number,
  toggle?: () => void,
  isOpen?: boolean
};

export default function Header({ name, type, toggle, isOpen, qty }: Props) {
  return (
    <div className={s.header}>
      <div onClick={toggle} style={{ cursor: 'pointer' }}>
        <SectionNameType name={name} type={type} />
      </div>

      {typeof qty === 'number' ? <span className={s.qty}>{qty}</span> : null}

      <Button kind="minimal" onClick={toggle}>
        <span className={cx(s.arrow, { [s.isOpen]: isOpen })}>
          <ChevronDown size={20} />
        </span>
      </Button>
    </div>
  );
}
