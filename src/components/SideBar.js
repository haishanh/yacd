import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Command, Activity, Globe, Link2, Settings, File } from 'react-feather';

import { useActions } from 'm/store';
import { switchTheme } from 'd/app';

import Icon from 'c/Icon';

import moon from 's/moon.svg';

import SvgYacd from './SvgYacd';

import s from 'c/SideBar.module.css';

const icons = {
  activity: Activity,
  globe: Globe,
  command: Command,
  file: File,
  settings: Settings,
  link: Link2
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText
}) {
  const Comp = icons[iconId];
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

SideBarRow.propTypes = {
  isActive: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  iconId: PropTypes.string,
  labelText: PropTypes.string
};

const pages = [
  {
    to: '/',
    iconId: 'activity',
    labelText: 'Overview'
  },
  {
    to: '/proxies',
    iconId: 'globe',
    labelText: 'Proxies'
  },
  {
    to: '/rules',
    iconId: 'command',
    labelText: 'Rules'
  },

  {
    to: '/connections',
    iconId: 'link',
    labelText: 'Conns'
  },
  {
    to: '/configs',
    iconId: 'settings',
    labelText: 'Config'
  },
  {
    to: '/logs',
    iconId: 'file',
    labelText: 'Logs'
  }
];

const actions = { switchTheme };

function SideBar({ location }) {
  const { switchTheme } = useActions(actions);
  return (
    <div className={s.root}>
      <a
        href="https://github.com/haishanh/yacd"
        className={s.logoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={s.logo}>
          <SvgYacd width={80} height={80} />
        </div>
      </a>

      <div className={s.rows}>
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={labelText}
          />
        ))}
      </div>
      <div className={s.themeSwitchContainer} onClick={switchTheme}>
        <Icon id={moon.id} width={20} height={20} />
      </div>
    </div>
  );
}

SideBar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default React.memo(SideBar);
