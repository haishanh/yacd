import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/Proxy.module.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDelay, switchProxy, requestDelayForProxy } from 'd/proxies';

const mapStateToProps = state => {
  const delay = getDelay(state);
  return { delay };
};

const mapDispatchToProps = dispatch => {
  return {
    switchProxy: bindActionCreators(switchProxy, dispatch),
    requestDelay: bindActionCreators(requestDelayForProxy, dispatch)
  };
};

const colorMap = {
  good: '#67C23A',
  normal: '#E6A23C',
  bad: '#F56C6C',
  na: '#909399'
};

class Proxy extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    parentName: PropTypes.string,
    checked: PropTypes.bool,
    switchProxy: PropTypes.func,
    requestDelay: PropTypes.func,
    delay: PropTypes.object
  };

  handleRadioOnChange = ev => {
    const { name, parentName, checked, switchProxy } = this.props;
    if (checked) return;
    switchProxy(parentName, name);
  };

  render() {
    const { name, parentName, checked, switchProxy, delay } = this.props;
    const id = parentName + ':' + name;
    const latency = delay[name];
    return (
      <label className={s0.Proxy} htmlFor={id}>
        <input
          type="radio"
          id={id}
          checked={checked}
          value={name}
          onChange={this.handleRadioOnChange}
        />
        <div className={s0.name}>{name}</div>
        {latency ? <LatencyLabel val={latency} /> : null}
      </label>
    );
  }
}

class LatencyLabel extends Component {
  static propTypes = {
    val: PropTypes.number.isRequired
  };

  render() {
    const { val } = this.props;
    let bg = colorMap.na;
    if (val < 100) {
      bg = colorMap.good;
    } else if (val < 300) {
      bg = colorMap.normal;
    } else {
      bg = colorMap.bad;
    }
    return (
      <div
        className={s0.LatencyLabel}
        style={{
          background: bg
        }}>
        <div>{val}</div>
        <div>ms</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Proxy);
