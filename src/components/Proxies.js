import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentHeader from 'c/ContentHeader';
import ProxyGroup from 'c/ProxyGroup';
import Button from 'c/Button';

import s0 from 'c/Proxies.module.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getUserProxies,
  getProxyGroupNames,
  fetchProxies,
  requestDelayAll
} from 'd/proxies';

function mapStateToProps(s) {
  return {
    proxies: getUserProxies(s),
    groupNames: getProxyGroupNames(s)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProxies: bindActionCreators(fetchProxies, dispatch),
    requestDelayAll: bindActionCreators(requestDelayAll, dispatch)
  };
}

class Proxies extends Component {
  static propTypes = {
    groupNames: PropTypes.array.isRequired,
    fetchProxies: PropTypes.func.isRequired,
    requestDelayAll: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchProxies();
  }

  render() {
    const { groupNames, requestDelayAll } = this.props;
    return (
      <div>
        <ContentHeader title="Proxies" />
        <div>
          <div className={s0.btnGroup}>
            <Button label="Test Latency" onClick={requestDelayAll} />
          </div>
          {groupNames.map(groupName => {
            return (
              <div className={s0.group} key={groupName}>
                <ProxyGroup name={groupName} />
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
)(Proxies);
