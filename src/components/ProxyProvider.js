import React from 'react';
import { ChevronDown, RotateCw, Zap } from 'react-feather';
import { formatDistance } from 'date-fns';
import ResizeObserver from 'resize-observer-polyfill';
import { motion } from 'framer-motion';
import cx from 'classnames';

import { useStoreState } from '../misc/store';
import { getClashAPIConfig } from '../ducks/app';
import { connect } from './StateProvider';
import { SectionNameType } from './shared/Basic';
import { ProxyList, ProxyListSummaryView } from './ProxyGroup';
import Button, { ButtonPlain } from './Button';

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

const mapStateToProps = s => ({
  apiConfig: getClashAPIConfig(s)
});

function ProxyProvider({ item, dispatch }: Props) {
  const { apiConfig } = useStoreState(mapStateToProps);
  const updateProvider = useCallback(
    () => dispatch(updateProviderByName(apiConfig, item.name)),
    [apiConfig, dispatch, item.name]
  );
  const healthcheckProvider = useCallback(
    () => dispatch(healthcheckProviderByName(apiConfig, item.name)),
    [apiConfig, dispatch, item.name]
  );

  const [isCollapsibleOpen, setCollapsibleOpen] = useState(false);
  const toggle = useCallback(() => setCollapsibleOpen(x => !x), []);
  const timeAgo = formatDistance(new Date(item.updatedAt), new Date());
  return (
    <div className={s.body}>
      <div className={s.header} onClick={toggle}>
        <SectionNameType name={item.name} type={item.vehicleType} />
        <ButtonPlain>
          <span className={cx(s.arrow, { [s.isOpen]: isCollapsibleOpen })}>
            <ChevronDown />
          </span>
        </ButtonPlain>
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
            icon={<Zap size={16} />}
            onClick={healthcheckProvider}
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

// import { useSpring, a } from 'react-spring';
// const Collapsible = memo(({ children, isOpen }) => {
//   const previous = usePrevious(isOpen);
//   const [refToMeature, { height: viewHeight }] = useMeasure();
//   const { height, opacity, visibility, transform } = useSpring({
//     from: {
//       height: 0,
//       opacity: 0,
//       transform: 'translate3d(20px,0,0)',
//       visibility: 'hidden'
//     },
//     to: {
//       height: isOpen ? viewHeight : 0,
//       opacity: isOpen ? 1 : 0,
//       visibility: isOpen ? 'visible' : 'hidden',
//       transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`
//     }
//   });
//   return (
//     <div>
//       <a.div
//         style={{
//           opacity,
//           willChange: 'transform, opacity, height, visibility',
//           visibility,
//           height: isOpen && previous === isOpen ? 'auto' : height
//         }}>
//         <a.div style={{ transform }} ref={refToMeature} children={children} />
//       </a.div>
//     </div>
//   );
// });

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
  // proxies: getProxies(s)
});
export default connect(mapState)(ProxyProvider);
