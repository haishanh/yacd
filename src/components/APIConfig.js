import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from 'c/Input';
import Button from 'c/Button';

import s0 from './APIConfig.module.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getClashAPIConfig, updateClashAPIConfig } from 'd/app';

const mapStateToProps = s => {
  const apiConfig = getClashAPIConfig(s);
  return { apiConfig };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClashAPIConfig: bindActionCreators(updateClashAPIConfig, dispatch)
  };
};

class APIConfig extends Component {
  static propTypes = {
    apiConfig: PropTypes.object.isRequired,
    updateClashAPIConfig: PropTypes.func.isRequired
  };

  state = {
    hostname: this.props.apiConfig.hostname,
    port: this.props.apiConfig.port,
    secret: this.props.apiConfig.secret
  };

  handleInputOnChange = e => {
    const target = e.target;
    const { name } = target;

    let value;
    if (name === 'port') {
      if (Number(target.value) < 0 || Number(target.value) > 65535) return;
    }
    value = target.value.trim();
    if (value === '') return;
    this.setState({ [name]: value });
  };

  handleConfirmOnClick = e => {
    const { hostname, port, secret } = this.state;
    this.props.updateClashAPIConfig({ hostname, port, secret });
  };

  render() {
    const { hostname, port, secret } = this.state;
    return (
      <div className={s0.root}>
        <div className={s0.header}>RESTful API config for Clash</div>
        <div className={s0.body}>
          <div className={s0.group}>
            <div className={s0.label}>Hostname and Port</div>
            <div className={s0.inputs}>
              <Input
                type="text"
                name="hostname"
                value={hostname}
                onChange={this.handleInputOnChange}
              />
              <Input
                type="number"
                name="port"
                value={port}
                onChange={this.handleInputOnChange}
              />
            </div>
          </div>
          <div className={s0.group}>
            <div className={s0.label}>Authorization Secret (Optional)</div>
            <div>
              <Input
                type="text"
                name="secret"
                value={secret}
                placeholder="Optional"
                onChange={this.handleInputOnChange}
              />
            </div>
          </div>
        </div>
        <div className={s0.footer}>
          <Button label="Confirm" onClick={this.handleConfirmOnClick} />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(APIConfig);
