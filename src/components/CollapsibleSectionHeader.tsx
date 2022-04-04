import cx from 'clsx';
import * as React from 'react';
import { ChevronDown } from 'react-feather';

import Button from './Button';
import s from './CollapsibleSectionHeader.module.scss';
import { SectionNameType } from './shared/Basic';
import { useTranslation } from 'react-i18next';

type Props = {
  name: string;
  type: string;
  qty?: number;
  toggle?: () => void;
  isOpen?: boolean;
};

export default function Header({ name, type, toggle, isOpen, qty }: Props) {
  const { t } = useTranslation();
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'Enter' || e.key === ' ') {
        toggle();
      }
    },
    [toggle]
  );
  return (
    <div
      className={s.header}
      onClick={toggle}
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
    >
      <div>
        <SectionNameType name={name} type={type} />
      </div>

      {typeof qty === 'number' ? <span className={s.qty}>{qty}</span> : null}

      <Button
        kind="minimal"
        onClick={toggle}
        className={s.btn}
        title={t('expand_collapse_proxy_group')}
      >
        <span className={cx(s.arrow, { [s.isOpen]: isOpen })}>
          <ChevronDown size={20} />
        </span>
      </Button>
    </div>
  );
}
