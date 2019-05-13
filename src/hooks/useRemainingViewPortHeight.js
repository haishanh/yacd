import { useState, useRef, useLayoutEffect, useCallback } from 'react';
/**
 * cosnt [ref, remainingHeight] = useRemainingViewPortHeight();
 *
 * return a reference, and the remaining height of the referenced dom node
 * to the bottom of the view port
 *
 */
export default function useRemainingViewPortHeight() {
  const refRulesContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState(200);
  function _updateContainerHeight() {
    const { top } = refRulesContainer.current.getBoundingClientRect();
    setContainerHeight(window.innerHeight - top);
  }
  const updateContainerHeight = useCallback(_updateContainerHeight, []);

  useLayoutEffect(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, [updateContainerHeight]);

  return [refRulesContainer, containerHeight];
}
