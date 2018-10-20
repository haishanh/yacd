import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import Icon from 'c/Icon';

import activity from 's/activity.svg';
import settings from 's/settings.svg';
import globe from 's/globe.svg';
import file from 's/file.svg';
import yacd from 's/yacd.svg';

import s from 'c/SideBar.module.scss';

class SideBarRowDump extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    iconId: PropTypes.string,
    labelText: PropTypes.string,
    pathname: PropTypes.string
  };

  render() {
    const { iconId, labelText, to, pathname } = this.props;
    const cls = pathname === to ? s.rowActive : s.row;
    return (
      <Link to={to} className={cls}>
        <Icon id={iconId} width={28} height={28} />
        <div className={s.label}>{labelText}</div>
      </Link>
    );
  }
}

const mapStateToProps = state => {
  const { pathname } = state.router.location;
  return { pathname };
};
const mapDispatchToProps = null;

const SideBarRow = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarRowDump);

class SideBar extends Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.logo}>
          <Icon id={yacd.id} width={80} height={80} />
        </div>

        <div className={s.rows}>
          <SideBarRow to="/" iconId={activity.id} labelText="Overview" />
          <SideBarRow to="/proxies" iconId={globe.id} labelText="Proxies" />
          <SideBarRow to="/configs" iconId={settings.id} labelText="Config" />
          <SideBarRow to="/logs" iconId={file.id} labelText="Logs" />
        </div>
      </div>
    );
  }
}

export default SideBar;
