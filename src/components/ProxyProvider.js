import React from 'react';
import { RotateCw, Zap } from 'react-feather';
import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';

import { connect, useStoreActions } from './StateProvider';
import Collapsible from './Collapsible';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';
import {
  ProxyList,
  ProxyListSummaryView,
  filterAvailableProxiesAndSort,
} from './ProxyGroup';
import Button from './Button';

import {
  getClashAPIConfig,
  getCollapsibleIsOpen,
  getProxySortBy,
  getHideUnavailableProxies,
} from '../store/app';
import {
  getDelay,
  updateProviderByName,
  healthcheckProviderByName,
} from '../store/proxies';

import s from './ProxyProvider.module.css';

const { useState, useCallback } = React;

type Props = {
  name: string,
  proxies: Array<string>,
  type: 'Proxy' | 'Rule',
  vehicleType: 'HTTP' | 'File' | 'Compatible',
  updatedAt?: string,
  dispatch: (any) => void,
  isOpen: boolean,
};

function ProxyProvider({
  name,
  proxies,
  vehicleType,
  updatedAt,
  isOpen,
  dispatch,
  apiConfig,
}: Props) {
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

  // const [isCollapsibleOpen, setCollapsibleOpen] = useState(false);
  // const toggle = useCallback(() => setCollapsibleOpen(x => !x), []);

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
  // hover: { scale: 1.1 },
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
    proxies: filterAvailableProxiesAndSort(
      proxies,
      delay,
      hideUnavailableProxies,
      proxySortBy
    ),
    isOpen: collapsibleIsOpen[`proxyProvider:${name}`],
  };
};

export default connect(mapState)(ProxyProvider);
