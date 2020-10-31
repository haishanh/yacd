import cx from 'clsx';
import React from 'react';
import Modal from 'react-modal';

import s0 from './Modal.module.css';

type Props = {
    isOpen: boolean;
    onRequestClose: (...args: any[]) => any;
    children: React.ReactNode;
    className?: string;
    overlayClassName?: string;
};

function ModalAPIConfig({ isOpen, onRequestClose, className, overlayClassName, children, ...otherProps }: Props) {
  const contentCls = cx(className, s0.content);
  const overlayCls = cx(overlayClassName, s0.overlay);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={contentCls}
      overlayClassName={overlayCls}
      {...otherProps}
    >
      {children}
    </Modal>
  );
}

export default React.memo(ModalAPIConfig);
