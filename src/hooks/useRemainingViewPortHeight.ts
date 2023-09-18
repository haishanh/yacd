import * as React from 'react';

const { useState, useRef, useCallback, useLayoutEffect } = React;

/**
 * cosnt [ref, remainingHeight] = useRemainingViewPortHeight();
 *
 * return a reference, and the remaining height of the referenced dom node
 * to the bottom of the view port
 *
 */
export default function useRemainingViewPortHeight<ElementType extends HTMLDivElement>(): [
  React.MutableRefObject<ElementType>,
  number,
] {
  const ref = useRef<ElementType>(null);
  const [containerHeight, setContainerHeight] = useState(200);
  const updateContainerHeight = useCallback(() => {
    const { top } = ref.current.getBoundingClientRect();
    setContainerHeight(window.innerHeight - top);
  }, []);

  useLayoutEffect(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, [updateContainerHeight]);

  return [ref, containerHeight];
}
