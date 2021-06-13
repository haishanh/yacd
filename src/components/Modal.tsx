import cx from 'clsx';
import * as React from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import s0 from './Modal.module.scss';

type Props = ReactModalProps & {
  isOpen: boolean;
  onRequestClose: (...args: any[]) => any;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
};

function ModalAPIConfig({
  isOpen,
  onRequestClose,
  className,
  overlayClassName,
  children,
  ...otherProps
}: Props) {
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
