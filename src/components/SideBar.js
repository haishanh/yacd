import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Command, Activity, Globe, Link2, Settings, File } from 'react-feather';

import { connect } from './StateProvider';
import { getTheme, switchTheme } from '../store/app';

import SvgYacd from './SvgYacd';
import s from './SideBar.module.css';

const { useCallback } = React;

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

function SideBar({ dispatch, theme }) {
  const location = useLocation();
  const switchThemeHooked = useCallback(() => {
    dispatch(switchTheme());
  }, [dispatch]);
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
      <button className={s.themeSwitchContainer} onClick={switchThemeHooked}>
        {theme === 'light' ? <MoonA /> : <Sun />}
      </button>
    </div>
  );
}

function MoonA() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        initial={{ rotate: -30 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.7 }}
      />
    </svg>
  );
}

function Sun() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <motion.g
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </motion.g>
    </svg>
  );
}

const mapState = s => ({ theme: getTheme(s) });
export default connect(mapState)(SideBar);
