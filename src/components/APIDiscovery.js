import React from 'react';
import { DOES_NOT_SUPPORT_FETCH, errors } from '../misc/errors';

import { connect } from './StateProvider';

import Modal from './Modal';
import APIConfig from './APIConfig';

import { getClashAPIConfig } from '../store/app';
import { closeModal } from '../store/modals';
import { fetchConfigs } from '../store/configs';

import s0 from './APIDiscovery.module.css';

const { useCallback, useEffect } = React;

function APIDiscovery({ dispatch, apiConfig, modals }) {
  if (!window.fetch) {
    const { detail } = errors[DOES_NOT_SUPPORT_FETCH];
    const err = new Error(detail);
    err.code = DOES_NOT_SUPPORT_FETCH;
    throw err;
  }

  const closeApiConfigModal = useCallback(() => {
    dispatch(closeModal('apiConfig'));
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchConfigs(apiConfig));
  }, [dispatch, apiConfig]);

  return (
    <Modal
      isOpen={modals.apiConfig}
      className={s0.content}
      overlayClassName={s0.overlay}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onRequestClose={closeApiConfigModal}
    >
      <div className={s0.container}>
        <APIConfig />
      </div>
    </Modal>
  );
}

const mapState = s => ({
  modals: s.modals,
  apiConfig: getClashAPIConfig(s)
});

export default connect(mapState)(APIDiscovery);
