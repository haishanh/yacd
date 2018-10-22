import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'c/Modal';
import APIConfig from 'c/APIConfig';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal } from 'd/modals';
import { fetchConfigs } from 'd/configs';

const mapStateToProps = state => {
  const modals = state.modals;
  return { modals };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: bindActionCreators(closeModal, dispatch),
    fetchConfigs: bindActionCreators(fetchConfigs, dispatch)
  };
};

class APIDiscovery extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    fetchConfigs: PropTypes.func,
    modals: PropTypes.object
  };

  componentDidMount() {
    this.props.fetchConfigs();
  }

  render() {
    const { modals, closeModal } = this.props;
    return (
      <Modal
        isOpen={modals.apiConfig}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => closeModal('apiConfig')}
      >
        <APIConfig />
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(APIDiscovery);
