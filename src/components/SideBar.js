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
  location,
  iconId,
  labelText,
  to
}) {
  const Comp = icons[iconId];
  const isActive = location.pathname === to;
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

SideBarRow.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  to: PropTypes.string.isRequired,
  iconId: PropTypes.string,
  labelText: PropTypes.string
};

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
        <SideBarRow
          to="/"
          location={location}
          iconId="activity"
          labelText="Overview"
        />
        <SideBarRow
          to="/proxies"
          location={location}
          iconId="globe"
          labelText="Proxies"
        />
        <SideBarRow
          to="/rules"
          location={location}
          iconId="command"
          labelText="Rules"
        />
        <SideBarRow
          to="/connections"
          location={location}
          iconId="link"
          labelText="Conns"
        />
        <SideBarRow
          to="/configs"
          location={location}
          iconId="settings"
          labelText="Config"
        />
        <SideBarRow
          to="/logs"
          location={location}
          iconId="file"
          labelText="Logs"
        />
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
