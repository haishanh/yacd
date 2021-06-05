import React from 'react';

import { DOES_NOT_SUPPORT_FETCH, errors } from '../misc/errors';
import { getClashAPIConfig } from '../store/app';
import { fetchConfigs } from '../store/configs';
import { closeModal } from '../store/modals';
import APIConfig from './APIConfig';
import s0 from './APIDiscovery.module.scss';
import Modal from './Modal';
import { connect } from './StateProvider';

const { useCallback, useEffect } = React;

function APIDiscovery({ dispatch, apiConfig, modals }) {
  if (!window.fetch) {
    const { detail } = errors[DOES_NOT_SUPPORT_FETCH];
    const err = new Error(detail);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
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
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; isOpen: any; className:... Remove this comment to see the full error message
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

const mapState = (s) => ({
  modals: s.modals,
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(APIDiscovery);
