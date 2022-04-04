import { formatDistance } from 'date-fns';
import * as React from 'react';
import { RotateCw, Zap } from 'react-feather';
import Button from 'src/components/Button';
import Collapsible from 'src/components/Collapsible';
import CollapsibleSectionHeader from 'src/components/CollapsibleSectionHeader';
import { useUpdateProviderItem } from 'src/components/proxies/proxies.hooks';
import { connect, useStoreActions } from 'src/components/StateProvider';
import { framerMotionResouce } from 'src/misc/motion';
import {
  getClashAPIConfig,
  getCollapsibleIsOpen,
  getHideUnavailableProxies,
  getProxySortBy,
} from 'src/store/app';
import { getDelay, healthcheckProviderByName } from 'src/store/proxies';
import { DelayMapping } from 'src/store/types';

import { useFilteredAndSorted } from './hooks';
import { ProxyList, ProxyListSummaryView } from './ProxyList';
import s from './ProxyProvider.module.scss';
import { useTranslation } from 'react-i18next';

const { useState, useCallback } = React;

type Props = {
  name: string;
  proxies: Array<string>;
  delay: DelayMapping;
  hideUnavailableProxies: boolean;
  proxySortBy: string;
  type: 'Proxy' | 'Rule';
  vehicleType: 'HTTP' | 'File' | 'Compatible';
  updatedAt?: string;
  dispatch: (x: any) => Promise<any>;
  isOpen: boolean;
  apiConfig: any;
};

function ProxyProviderImpl({
  name,
  proxies: all,
  delay,
  hideUnavailableProxies,
  proxySortBy,
  vehicleType,
  updatedAt,
  isOpen,
  dispatch,
  apiConfig,
}: Props) {
  const { t } = useTranslation();

  const proxies = useFilteredAndSorted(
    all,
    delay,
    hideUnavailableProxies,
    proxySortBy
  );
  const [isHealthcheckLoading, setIsHealthcheckLoading] = useState(false);

  const updateProvider = useUpdateProviderItem({ dispatch, apiConfig, name });

  const healthcheckProvider = useCallback(async () => {
    setIsHealthcheckLoading(true);
    await dispatch(healthcheckProviderByName(apiConfig, name));
    setIsHealthcheckLoading(false);
  }, [apiConfig, dispatch, name, setIsHealthcheckLoading]);

  const {
    app: { updateCollapsibleIsOpen },
  } = useStoreActions();

  const toggle = useCallback(() => {
    updateCollapsibleIsOpen('proxyProvider', name, !isOpen);
  }, [isOpen, updateCollapsibleIsOpen, name]);

  const timeAgo = formatDistance(new Date(updatedAt), new Date());
  return (
    <div className={s.body}>
      <CollapsibleSectionHeader
        name={name}
        toggle={toggle}
        type={vehicleType}
        isOpen={isOpen}
        qty={proxies.length}
      />
      <div className={s.updatedAt}>
        <small>Updated {timeAgo} ago</small>
      </div>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; isOpen: boolean; }' i... Remove this comment to see the full error message */}
      <Collapsible isOpen={isOpen}>
        <ProxyList all={proxies} />
        <div className={s.actionFooter}>
          <Button text={t('update_proxy_provider')} start={<Refresh />} onClick={updateProvider} />
          <Button
            text={t('health_check')}
            start={<Zap size={16} />}
            onClick={healthcheckProvider}
            isLoading={isHealthcheckLoading}
          />
        </div>
      </Collapsible>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; isOpen: boolean; }' is ... Remove this comment to see the full error message */}
      <Collapsible isOpen={!isOpen}>
        <ProxyListSummaryView all={proxies} />
      </Collapsible>
    </div>
  );
}

const button = {
  rest: { scale: 1 },
  pressed: { scale: 0.95 },
};
const arrow = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.3 } },
};
function Refresh() {
  const module = framerMotionResouce.read();
  const motion = module.motion;
  return (
    <motion.div
      className={s.refresh}
      variants={button}
      initial="rest"
      whileHover="hover"
      whileTap="pressed"
    >
      <motion.div className="flexCenter" variants={arrow}>
        <RotateCw size={16} />
      </motion.div>
    </motion.div>
  );
}

const mapState = (s, { proxies, name }) => {
  const hideUnavailableProxies = getHideUnavailableProxies(s);
  const delay = getDelay(s);
  const collapsibleIsOpen = getCollapsibleIsOpen(s);
  const apiConfig = getClashAPIConfig(s);

  const proxySortBy = getProxySortBy(s);

  return {
    apiConfig,
    proxies,
    delay,
    hideUnavailableProxies,
    proxySortBy,
    isOpen: collapsibleIsOpen[`proxyProvider:${name}`],
  };
};

export const ProxyProvider = connect(mapState)(ProxyProviderImpl);
