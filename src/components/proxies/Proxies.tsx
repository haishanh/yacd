import * as React from 'react';
import { Zap } from 'react-feather';

import { getClashAPIConfig } from '../../store/app';
import {
  fetchProxies,
  getDelay,
  getProxyGroupNames,
  getProxyProviders,
  getShowModalClosePrevConns,
  requestDelayAll,
} from '../../store/proxies';
import Button from '../Button';
import ContentHeader from '../ContentHeader';
import BaseModal from '../shared/BaseModal';
import { Fab, position as fabPosition } from '../shared/Fab';
import { connect, useStoreActions } from '../StateProvider';
import Equalizer from '../svg/Equalizer';
import { ClosePrevConns } from './ClosePrevConns';
import s0 from './Proxies.module.css';
import { ProxyGroup } from './ProxyGroup';
import { ProxyProviderList } from './ProxyProviderList';
import Settings from './Settings';
import { TextFilter } from './TextFilter';

const { useState, useEffect, useCallback, useRef } = React;

function Proxies({
  dispatch,
  groupNames,
  delay,
  proxyProviders,
  apiConfig,
  showModalClosePrevConns,
}) {
  const refFetchedTimestamp = useRef<{ startAt?: number; completeAt?: number }>(
    {}
  );
  const [isTestingLatency, setIsTestingLatency] = useState(false);
  const requestDelayAllFn = useCallback(() => {
    if (isTestingLatency) return;

    setIsTestingLatency(true);
    dispatch(requestDelayAll(apiConfig)).then(
      () => setIsTestingLatency(false),
      () => setIsTestingLatency(false)
    );
  }, [apiConfig, dispatch, isTestingLatency]);

  const fetchProxiesHooked = useCallback(() => {
    refFetchedTimestamp.current.startAt = Date.now();
    dispatch(fetchProxies(apiConfig)).then(() => {
      refFetchedTimestamp.current.completeAt = Date.now();
    });
  }, [apiConfig, dispatch]);
  useEffect(() => {
    // fetch it now
    fetchProxiesHooked();

    // arm a window on focus listener to refresh it
    const fn = () => {
      if (
        refFetchedTimestamp.current.startAt &&
        Date.now() - refFetchedTimestamp.current.startAt > 3e4 // 30s
      ) {
        fetchProxiesHooked();
      }
    };
    window.addEventListener('focus', fn, false);
    return () => window.removeEventListener('focus', fn, false);
  }, [fetchProxiesHooked]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const closeSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  const {
    proxies: { closeModalClosePrevConns, closePrevConnsAndTheModal },
  } = useStoreActions();

  return (
    <>
      <BaseModal
        isOpen={isSettingsModalOpen}
        onRequestClose={closeSettingsModal}
      >
        <Settings />
      </BaseModal>
      <div className={s0.topBar}>
        <ContentHeader title="Proxies" />
        <div className={s0.topBarRight}>
          <div className={s0.textFilterContainer}>
            <TextFilter />
          </div>
          <Button kind="minimal" onClick={() => setIsSettingsModalOpen(true)}>
            <Equalizer size={16} />
          </Button>
        </div>
      </div>
      <div>
        {groupNames.map((groupName: string) => {
          return (
            <div className={s0.group} key={groupName}>
              <ProxyGroup
                name={groupName}
                delay={delay}
                apiConfig={apiConfig}
                dispatch={dispatch}
              />
            </div>
          );
        })}
      </div>
      <ProxyProviderList items={proxyProviders} />
      <div style={{ height: 60 }} />
      <Fab
        icon={isTestingLatency ? <ColorZap /> : <Zap width={16} height={16} />}
        onClick={requestDelayAllFn}
        text="Test Latency"
        position={fabPosition}
      />
      <BaseModal
        isOpen={showModalClosePrevConns}
        onRequestClose={closeModalClosePrevConns}
      >
        <ClosePrevConns
          onClickPrimaryButton={() => closePrevConnsAndTheModal(apiConfig)}
          onClickSecondaryButton={closeModalClosePrevConns}
        />
      </BaseModal>
    </>
  );
}

function ColorZap() {
  return (
    <div
      className={s0.spining}
      style={{
        width: 48,
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Zap width={16} height={16} />
    </div>
  );
}

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
  groupNames: getProxyGroupNames(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s),
  showModalClosePrevConns: getShowModalClosePrevConns(s),
});

export default connect(mapState)(Proxies);
