import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { useActions } from 'm/store';
import { switchTheme } from 'd/app';

import Icon from 'c/Icon';

import activity from 's/activity.svg';
import settings from 's/settings.svg';
import globe from 's/globe.svg';
import file from 's/file.svg';
import yacd from 's/yacd.svg';
import moon from 's/moon.svg';

import s from 'c/SideBar.module.scss';

const SideBarRow = React.memo(function SideBarRow({ iconId, labelText, to }) {
  return (
    <NavLink exact to={to} className={s.row} activeClassName={s.rowActive}>
      <Icon id={iconId} width={28} height={28} />
      <div className={s.label}>{labelText}</div>
    </NavLink>
  );
});

SideBarRow.propTypes = {
  to: PropTypes.string.isRequired,
  iconId: PropTypes.string,
  labelText: PropTypes.string
};

const actions = { switchTheme };

function SideBar() {
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
          <Icon id={yacd.id} width={80} height={80} />
        </div>
      </a>

      <div className={s.rows}>
        <SideBarRow to="/" iconId={activity.id} labelText="Overview" />
        <SideBarRow to="/proxies" iconId={globe.id} labelText="Proxies" />
        <SideBarRow to="/configs" iconId={settings.id} labelText="Config" />
        <SideBarRow to="/logs" iconId={file.id} labelText="Logs" />
      </div>

      <div className={s.themeSwitchContainer} onClick={switchTheme}>
        <Icon id={moon.id} width={20} height={20} />
      </div>
    </div>
  );
}

export default React.memo(SideBar);
