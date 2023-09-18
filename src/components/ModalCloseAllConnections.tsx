import cx from 'clsx';
import React from 'react';
import Modal from 'react-modal';

import Button from './Button';
import modalStyle from './Modal.module.scss';
import s from './ModalCloseAllConnections.module.scss';

const { useRef, useCallback, useMemo } = React;

export default function Comp({
  isOpen,
  onRequestClose,
  primaryButtonOnTap,
}: {
  isOpen: boolean;
  onRequestClose: (x: any) => void;
  primaryButtonOnTap: () => void;
}) {
  const primaryButtonRef = useRef(null);
  const onAfterOpen = useCallback(() => {
    primaryButtonRef.current.focus();
  }, []);
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
      onAfterOpen={onAfterOpen}
      className={className}
      overlayClassName={cx(modalStyle.overlay, s.overlay)}
    >
      <p>Are you sure you want to close all connections?</p>
      <div className={s.btngrp}>
        <Button onClick={primaryButtonOnTap} ref={primaryButtonRef}>
          I&#39;m sure
        </Button>
        {/* im lazy :) */}
        <div style={{ width: 20 }} />
        <Button onClick={onRequestClose}>No</Button>
      </div>
    </Modal>
  );
}
