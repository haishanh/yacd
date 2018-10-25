import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Proxy from 'c/Proxy';

import s0 from './ProxyGroup.module.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProxies, switchProxy } from 'd/proxies';

const mapStateToProps = s => {
  return {
    proxies: getUserProxies(s)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    switchProxy: bindActionCreators(switchProxy, dispatch)
  };
};

// should move this to sth like constants.js
// const userProxyTypes = ['Shadowsocks', 'Vmess', 'Socks5'];

class ProxyGroup extends Component {
  static propTypes = {
    // group name
    name: PropTypes.string.isRequired,
    proxies: PropTypes.object,
    switchProxy: PropTypes.func
  };

  reOrderProxies = memoize((list, now) => {
    const a = [now];
    list.forEach(i => i !== now && a.push(i));
    return a;
  });

  render() {
    const { name, proxies, switchProxy } = this.props;
    const group = proxies[name];
    let list;
    if (group.all) {
      list = this.reOrderProxies(group.all, group.now);
    } else {
      list = [group.now];
    }
    return (
      <div className={s0.group}>
        <div className={s0.header}>
          <h2>
            <span>{name}</span>
            <span>{group.type}</span>
          </h2>
        </div>
        <div className={s0.list}>
          {list.map(proxyName => {
            return (
              <div
                className={s0.proxy}
                key={proxyName}
                onClick={() => switchProxy(name, proxyName)}
              >
                <Proxy name={proxyName} now={proxyName === group.now} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProxyGroup);
