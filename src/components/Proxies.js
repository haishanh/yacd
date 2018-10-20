import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentHeader from 'c/ContentHeader';
import Proxy from 'c/Proxy';
import Button from 'c/Button';

import cx from 'classnames';
import s0 from 'c/Proxies.module.scss';

const th = cx(s0.row, s0.th, 'border-bottom');
// const colItem = cx(s0.colItem, 'border-bottom');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProxies, fetchProxies, requestDelayAll } from 'd/proxies';

function mapStateToProps(s) {
  return {
    proxies: getProxies(s)
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
    proxies: PropTypes.object.isRequired,
    fetchProxies: PropTypes.func.isRequired,
    requestDelayAll: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchProxies();
  }

  render() {
    const { proxies, requestDelayAll } = this.props;

    return (
      <div>
        <ContentHeader title="Proxies" />

        <div className={s0.root}>
          <div className={s0.btnGroup}>
            <Button label="Test Latency" onClick={requestDelayAll} />
          </div>
          <div className={th}>
            <div className={s0.col1}>Name</div>
            <div className={s0.col2}>Type</div>
            <div className={s0.col3}>All</div>
          </div>

          <div>
            {Object.keys(proxies).map(k => {
              const o = proxies[k];
              return <ProxyRow name={k} key={k} {...o} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

class ProxyRow extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    all: PropTypes.array,
    now: PropTypes.string
  };

  render() {
    const { name, type, all, now } = this.props;
    return (
      <div className={s0.row}>
        <div className={s0.col1}>{name}</div>
        <div className={s0.col2}>{type}</div>
        {all ? (
          <div className={s0.col3 + ' border-left'}>
            {all.map(p => {
              return (
                <div className={s0.colItem} key={p}>
                  <Proxy name={p} parentName={name} checked={p === now} />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Proxies);
