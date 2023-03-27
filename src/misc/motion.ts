import { createResource } from './createResource';

export const framerMotionResource = createResource(() => import('framer-motion'));
