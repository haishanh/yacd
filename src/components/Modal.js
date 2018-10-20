import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import s0 from './Modal.module.scss';

class ModalAPIConfig extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired
  };

  handleClick = e => {
    e.preventDefault();
  };

  render() {
    const { isOpen, onRequestClose, children, ...rest } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="test"
        className={s0.content}
        overlayClassName={s0.overlay}
        {...rest}
      >
        {children}
      </Modal>
    );
  }
}

export default ModalAPIConfig;
