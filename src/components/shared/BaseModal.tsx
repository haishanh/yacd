import cx from 'clsx';
import * as React from 'react';
import Modal from 'react-modal';

import modalStyle from '../Modal.module.scss';
import s from './BaseModal.module.scss';

const { useMemo } = React;

export default function BaseModal({
  isOpen,
  onRequestClose,
  children,
}: {
  isOpen: boolean;
  onRequestClose: (ev: any) => void;
  children: React.ReactNode;
}) {
  const className = useMemo(
    () => ({
      base: cx(modalStyle.content, s.cnt),
      afterOpen: s.afterOpen,
      beforeClose: '',
    }),
    [],
  );
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={className}
      overlayClassName={cx(modalStyle.overlay, s.overlay)}
    >
      {children}
    </Modal>
  );
}
