import { Tooltip } from '@reach/tooltip';
import cx from 'clsx';
import * as React from 'react';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { FcAreaChart, FcDocument, FcGlobe, FcLink, FcRuler, FcSettings } from 'react-icons/fc';
import { Link, useLocation } from 'react-router-dom';

import { ThemeSwitcher } from './shared/ThemeSwitcher';
import s from './SideBar.module.scss';

const icons = {
  activity: FcAreaChart,
  globe: FcGlobe,
  command: FcRuler,
  file: FcDocument,
  settings: FcSettings,
  link: FcLink,
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText,
}: SideBarRowProps) {
  const Comp = icons[iconId];
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

interface SideBarRowProps {
  isActive: boolean;
  to: string;
  iconId?: string;
  labelText?: string;
}

const pages = [
  { to: '/', iconId: 'activity', labelText: 'Overview' },
  { to: '/proxies', iconId: 'globe', labelText: 'Proxies' },
  { to: '/rules', iconId: 'command', labelText: 'Rules' },
  { to: '/connections', iconId: 'link', labelText: 'Conns' },
  { to: '/configs', iconId: 'settings', labelText: 'Config' },
  { to: '/logs', iconId: 'file', labelText: 'Logs' },
];

export default function SideBar() {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <div className={s.root}>
      <div className={s.logoPlaceholder} />
      <div className={s.rows}>
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={t(labelText)}
          />
        ))}
      </div>
      <div className={s.footer}>
        <ThemeSwitcher />
        <Tooltip label={t('about')}>
          <Link to="/about" className={s.iconWrapper}>
            <Info size={20} />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
