import { createResource } from './createResource';

export const framerMotionResouce = createResource(
  () => import('framer-motion')
);
