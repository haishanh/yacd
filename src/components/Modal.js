import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import s0 from './Modal.module.scss';

function ModalAPIConfig({ isOpen, onRequestClose, children, ...otherProps }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="API-Config"
      className={s0.content}
      overlayClassName={s0.overlay}
      {...otherProps}
    >
      {children}
    </Modal>
  );
}

ModalAPIConfig.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default React.memo(ModalAPIConfig);
