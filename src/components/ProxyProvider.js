import React from 'react';
import { ChevronDown, RotateCw, Zap } from 'react-feather';
import { formatDistance } from 'date-fns';
import ResizeObserver from 'resize-observer-polyfill';
import { motion } from 'framer-motion';
import cx from 'classnames';

import { connect } from './StateProvider';
import { SectionNameType } from './shared/Basic';
import { ProxyList, ProxyListSummaryView } from './ProxyGroup';
import Button from './Button';

import { getClashAPIConfig } from '../store/app';
import {
  updateProviderByName,
  healthcheckProviderByName
} from '../store/proxies';

import s from './ProxyProvider.module.css';

const { memo, useState, useRef, useEffect, useCallback } = React;

type Props = {
  item: Array<{
    name: string,
    proxies: Array<string>,
    type: 'Proxy' | 'Rule',
    vehicleType: 'HTTP' | 'File' | 'Compatible',
    updatedAt?: string
  }>,
  proxies: {
    [string]: any
  },
  dispatch: any => void
};

function ProxyProvider({ item, dispatch, apiConfig }: Props) {
  const [isHealthcheckLoading, setIsHealthcheckLoading] = useState(false);
  const updateProvider = useCallback(
    () => dispatch(updateProviderByName(apiConfig, item.name)),
    [apiConfig, dispatch, item.name]
  );
  const healthcheckProvider = useCallback(async () => {
    setIsHealthcheckLoading(true);
    await dispatch(healthcheckProviderByName(apiConfig, item.name));
    setIsHealthcheckLoading(false);
  }, [apiConfig, dispatch, item.name, setIsHealthcheckLoading]);

  const [isCollapsibleOpen, setCollapsibleOpen] = useState(false);
  const toggle = useCallback(() => setCollapsibleOpen(x => !x), []);
  const timeAgo = formatDistance(new Date(item.updatedAt), new Date());
  return (
    <div className={s.body}>
      <div className={s.header} onClick={toggle}>
        <SectionNameType name={item.name} type={item.vehicleType} />
        <Button kind="minimal">
          <span className={cx(s.arrow, { [s.isOpen]: isCollapsibleOpen })}>
            <ChevronDown />
          </span>
        </Button>
      </div>
      <div className={s.updatedAt}>
        <small>Updated {timeAgo} ago</small>
      </div>
      <Collapsible2 isOpen={isCollapsibleOpen}>
        <ProxyList all={item.proxies} />
        <div className={s.actionFooter}>
          <Button text="Update" start={<Refresh />} onClick={updateProvider} />
          <Button
            text="Health Check"
            start={<Zap size={16} />}
            onClick={healthcheckProvider}
            isLoading={isHealthcheckLoading}
          />
        </div>
      </Collapsible2>
      <Collapsible2 isOpen={!isCollapsibleOpen}>
        <ProxyListSummaryView all={item.proxies} />
      </Collapsible2>
    </div>
  );
}

const button = {
  rest: { scale: 1 },
  // hover: { scale: 1.1 },
  pressed: { scale: 0.95 }
};
const arrow = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.3 } }
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

function useMeasure() {
  const ref = useRef();
  const [bounds, set] = useState({ height: 0 });
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => set(entry.contentRect));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, bounds];
}

const variantsCollpapsibleWrap = {
  initialOpen: {
    height: 'auto',
    transition: { duration: 0 }
  },
  open: height => ({
    height,
    opacity: 1,
    visibility: 'visible',
    transition: { duration: 0.3 }
  }),
  closed: {
    height: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: { duration: 0.3 }
  }
};
const variantsCollpapsibleChildContainer = {
  open: {
    x: 0
  },
  closed: {
    x: 20
  }
};

const Collapsible2 = memo(({ children, isOpen }) => {
  const previous = usePrevious(isOpen);
  const [refToMeature, { height }] = useMeasure();
  return (
    <div>
      <motion.div
        animate={
          isOpen && previous === isOpen
            ? 'initialOpen'
            : isOpen
            ? 'open'
            : 'closed'
        }
        custom={height}
        variants={variantsCollpapsibleWrap}
      >
        <motion.div
          variants={variantsCollpapsibleChildContainer}
          ref={refToMeature}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
});

const mapState = s => ({
  apiConfig: getClashAPIConfig(s)
});
export default connect(mapState)(ProxyProvider);
