import React, { useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';

import Modal from 'c/Modal';
import APIConfig from 'c/APIConfig';

import { closeModal } from 'd/modals';
import { fetchConfigs } from 'd/configs';

import s0 from './APIDiscovery.module.scss';

const mapStateToProps = s => ({
  modals: s.modals
});

const actions = {
  closeModal,
  fetchConfigs
};

export default function APIDiscovery() {
  const { modals } = useStoreState(mapStateToProps);
  const { closeModal, fetchConfigs } = useActions(actions);
  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <Modal
      isOpen={modals.apiConfig}
      className={s0.content}
      overlayClassName={s0.overlay}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onRequestClose={() => closeModal('apiConfig')}
    >
      <APIConfig />
    </Modal>
  );
}
