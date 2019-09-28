import React from 'react';

const { useState, useRef, useCallback, useEffect } = React;

/**
 * cosnt [ref, remainingHeight] = useRemainingViewPortHeight();
 *
 * return a reference, and the remaining height of the referenced dom node
 * to the bottom of the view port
 *
 */
export default function useRemainingViewPortHeight() {
  const ref = useRef(null);
  const [containerHeight, setContainerHeight] = useState(200);
  const updateContainerHeight = useCallback(() => {
    const { top } = ref.current.getBoundingClientRect();
    setContainerHeight(window.innerHeight - top);
  }, []);

  useEffect(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, [updateContainerHeight]);

  return [ref, containerHeight];
}
