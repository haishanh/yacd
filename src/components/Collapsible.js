import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { motion } from 'framer-motion';

const { memo, useState, useRef, useEffect } = React;

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

const Collapsible = memo(({ children, isOpen }) => {
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

export default Collapsible;
