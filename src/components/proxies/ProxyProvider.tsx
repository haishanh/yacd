import { Tooltip } from '@reach/tooltip';
import { formatDistance } from 'date-fns';
import { useAtom } from 'jotai';
import * as React from 'react';
import { RotateCw } from 'react-feather';
import Button from 'src/components/Button';
import CollapsibleSectionHeader from 'src/components/CollapsibleSectionHeader';
import { useUpdateProviderItem } from 'src/components/proxies/proxies.hooks';
import { connect } from 'src/components/StateProvider';
import { framerMotionResource } from 'src/misc/motion';
import {
  collapsibleIsOpenAtom,
  hideUnavailableProxiesAtom,
  proxySortByAtom,
  useApiConfig,
} from 'src/store/app';
import { getDelay, healthcheckProviderByName } from 'src/store/proxies';
import { DelayMapping, State } from 'src/store/types';

import { ZapAnimated } from '$src/components/shared/ZapAnimated';
import { useState2 } from '$src/hooks/basic';

import { useFilteredAndSorted } from './hooks';
import { ProxyList, ProxyListSummaryView } from './ProxyList';
import s from './ProxyProvider.module.scss';

const { useCallback } = React;

type Props = {
  name: string;
  proxies: string[];
  delay: DelayMapping;
  type: 'Proxy' | 'Rule';
  vehicleType: 'HTTP' | 'File' | 'Compatible';
  updatedAt?: string;
  dispatch: (x: any) => Promise<any>;
};

function ProxyProviderImpl({ name, proxies: all, delay, vehicleType, updatedAt, dispatch }: Props) {
  const [collapsibleIsOpen, setCollapsibleIsOpen] = useAtom(collapsibleIsOpenAtom);
  const isOpen = collapsibleIsOpen[`proxyProvider:${name}`];
  const [proxySortBy] = useAtom(proxySortByAtom);
  const [hideUnavailableProxies] = useAtom(hideUnavailableProxiesAtom);
  const apiConfig = useApiConfig();
  const proxies = useFilteredAndSorted(all, delay, hideUnavailableProxies, proxySortBy);
  const checkingHealth = useState2(false);
  const updateProvider = useUpdateProviderItem({ dispatch, apiConfig, name });
  const healthcheckProvider = useCallback(() => {
    if (checkingHealth.value) return;
    checkingHealth.set(true);
    const stop = () => checkingHealth.set(false);
    dispatch(healthcheckProviderByName(apiConfig, name)).then(stop, stop);
  }, [apiConfig, dispatch, name, checkingHealth]);
  const updateCollapsibleIsOpen = useCallback(
    (prefix: string, name: string, v: boolean) => {
      setCollapsibleIsOpen((s) => ({ ...s, [`${prefix}:${name}`]: v }));
    },
    [setCollapsibleIsOpen],
  );
  const toggle = useCallback(() => {
    updateCollapsibleIsOpen('proxyProvider', name, !isOpen);
  }, [isOpen, updateCollapsibleIsOpen, name]);

  const timeAgo = formatDistance(new Date(updatedAt), new Date());
  return (
    <div className={s.main}>
      <div className={s.head}>
        <CollapsibleSectionHeader
          name={name}
          toggle={toggle}
          type={vehicleType}
          isOpen={isOpen}
          qty={proxies.length}
        />

        <div className={s.action}>
          <Tooltip label={'Update'}>
            <Button kind="circular" onClick={updateProvider}>
              <Refresh />
            </Button>
          </Tooltip>
          <Tooltip label={'Health Check'}>
            <Button kind="circular" onClick={healthcheckProvider}>
              <ZapAnimated animate={checkingHealth.value} size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className={s.updatedAt}>
        <small>Updated {timeAgo} ago</small>
      </div>
      {isOpen ? <ProxyList all={proxies} /> : <ProxyListSummaryView all={proxies} />}
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
  const module = framerMotionResource.read();
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

const mapState = (s: State, { proxies }) => {
  const delay = getDelay(s);
  return {
    proxies,
    delay,
  };
};

export const ProxyProvider = connect(mapState)(ProxyProviderImpl);
