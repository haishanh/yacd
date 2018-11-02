import React, { useEffect } from 'react';
import { useActions, useComponentState } from 'm/store';

import Modal from 'c/Modal';
import APIConfig from 'c/APIConfig';

import { closeModal } from 'd/modals';
import { fetchConfigs } from 'd/configs';

const mapStateToProps = s => ({
  modals: s.modals
});

const actions = {
  closeModal,
  fetchConfigs
};

export default function APIDiscovery() {
  const { modals } = useComponentState(mapStateToProps);
  const { closeModal, fetchConfigs } = useActions(actions);
  useEffect(() => {
    fetchConfigs();
  }, []);

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
