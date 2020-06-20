import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import * as React from 'react';
import { RotateCw, Zap } from 'react-feather';

import {
  getClashAPIConfig,
  getCollapsibleIsOpen,
  getHideUnavailableProxies,
  getProxySortBy,
} from '../../store/app';
import {
  DelayMapping,
  getDelay,
  healthcheckProviderByName,
  updateProviderByName,
} from '../../store/proxies';
import Button from '../Button';
import Collapsible from '../Collapsible';
import CollapsibleSectionHeader from '../CollapsibleSectionHeader';
import { connect, useStoreActions } from '../StateProvider';
import { useFilteredAndSorted } from './hooks';
import { ProxyList, ProxyListSummaryView } from './ProxyList';
import s from './ProxyProvider.module.css';

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
  const proxies = useFilteredAndSorted(
    all,
    delay,
    hideUnavailableProxies,
    proxySortBy
  );
  const [isHealthcheckLoading, setIsHealthcheckLoading] = useState(false);
  const updateProvider = useCallback(
    () => dispatch(updateProviderByName(apiConfig, name)),
    [apiConfig, dispatch, name]
  );
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
      <Collapsible isOpen={isOpen}>
        <ProxyList all={proxies} />
        <div className={s.actionFooter}>
          <Button text="Update" start={<Refresh />} onClick={updateProvider} />
          <Button
            text="Health Check"
            start={<Zap size={16} />}
            onClick={healthcheckProvider}
            isLoading={isHealthcheckLoading}
          />
        </div>
      </Collapsible>
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
