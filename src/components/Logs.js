import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'c/Icon';
import ContentHeader from 'c/ContentHeader';
import { fetchLogs } from '../api/logs';

import yacd from 's/yacd.svg';

import s0 from 'c/Logs.module.scss';
const colors = {
  debug: 'none',
  // debug: '#8a8a8a',
  info: '#454545',
  // info: '#147d14',
  warning: '#b99105',
  error: '#c11c1c'
};

class LogLine extends Component {
  static propTypes = {
    time: PropTypes.string,
    even: PropTypes.bool,
    type: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired
  };

  render() {
    const { time, type, payload, even } = this.props;
    const className = cx({ even });
    return (
      <li className={className}>
        <div className={s0.logMeta}>
          <div className={s0.logTime}>{time}</div>
          <div className={s0.logType} style={{ backgroundColor: colors[type] }}>
            {type}
          </div>
          <div className={s0.logText}>{payload}</div>
        </div>
      </li>
    );
  }
}

class Logs extends Component {
  // static propTypes = {
  //   isOpen: PropTypes.bool.isRequired,
  //   onRequestClose: PropTypes.func.isRequired
  // };
  state = {
    logs: []
  };

  handle = null;

  componentDidMount() {
    this.handle = fetchLogs();
    this.setState({ logs: this.handle.logs });
    this.handle.updateCallback = () => {
      this.setState({ logs: this.handle.logs });
    };
  }

  componentWillUnmount() {
    this.handle.updateCallback = null;
  }

  render() {
    const { logs } = this.state;
    return (
      <div>
        <ContentHeader title="Logs" />
        {logs.length === 0 ? (
          <div className={s0.logPlaceholder}>
            <div>
              <Icon id={yacd.id} width={200} height={200} />
            </div>
            <div>No logs yet, hang tight...</div>
          </div>
        ) : (
          <div className={s0.logs}>
            <ul className={s0.logUl}>
              {logs.map(l => (
                <LogLine key={l.id} {...l} />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Logs;
