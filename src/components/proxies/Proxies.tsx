import { Tooltip } from '@reach/tooltip';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'src/components/Button';
import { ContentHeader } from 'src/components/ContentHeader';
import { ClosePrevConns } from 'src/components/proxies/ClosePrevConns';
import { ProxyGroup } from 'src/components/proxies/ProxyGroup';
import { ProxyPageFab } from 'src/components/proxies/ProxyPageFab';
import { ProxyProviderList } from 'src/components/proxies/ProxyProviderList';
import Settings from 'src/components/proxies/Settings';
import BaseModal from 'src/components/shared/BaseModal';
import { connect, useStoreActions } from 'src/components/StateProvider';
import Equalizer from 'src/components/svg/Equalizer';
import { proxyFilterTextAtom } from 'src/store/proxies';
import {
  fetchProxies,
  getDelay,
  getProxyGroupNames,
  getProxyProviders,
  getShowModalClosePrevConns,
} from 'src/store/proxies';
import type { DelayMapping, DispatchFn, FormattedProxyProvider, State } from 'src/store/types';

import { TextFilter } from '$src/components/shared/TextFilter';
import { useApiConfig } from '$src/store/app';

import s0 from './Proxies.module.scss';

const { useState, useEffect, useCallback, useRef } = React;

function Proxies({
  dispatch,
  groupNames,
  delay,
  proxyProviders,
  showModalClosePrevConns,
}: {
  dispatch: DispatchFn;
  groupNames: string[];
  delay: DelayMapping;
  proxyProviders: FormattedProxyProvider[];
  showModalClosePrevConns: boolean;
}) {
  const apiConfig = useApiConfig();
  const refFetchedTimestamp = useRef<{ startAt?: number; completeAt?: number }>({});

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

  const { t } = useTranslation();

  return (
    <>
      <BaseModal isOpen={isSettingsModalOpen} onRequestClose={closeSettingsModal}>
        <Settings />
      </BaseModal>
      <div className={s0.topBar}>
        <ContentHeader title={t('Proxies')} />
        <div className={s0.topBarRight}>
          <div className={s0.textFilterContainer}>
            <TextFilter textAtom={proxyFilterTextAtom} />
          </div>
          <Tooltip label={t('settings')}>
            <Button kind="minimal" onClick={() => setIsSettingsModalOpen(true)}>
              <Equalizer size={16} />
            </Button>
          </Tooltip>
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
      <ProxyPageFab dispatch={dispatch} apiConfig={apiConfig} proxyProviders={proxyProviders} />
      <BaseModal isOpen={showModalClosePrevConns} onRequestClose={closeModalClosePrevConns}>
        <ClosePrevConns
          onClickPrimaryButton={() => closePrevConnsAndTheModal(apiConfig)}
          onClickSecondaryButton={closeModalClosePrevConns}
        />
      </BaseModal>
    </>
  );
}

const mapState = (s: State) => ({
  groupNames: getProxyGroupNames(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s),
  showModalClosePrevConns: getShowModalClosePrevConns(s),
});

export default connect(mapState)(Proxies);
