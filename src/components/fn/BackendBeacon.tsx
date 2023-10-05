import React, { Suspense } from 'react';

import { useClashConfig } from '$src/store/configs';

export function BackendBeacon() {
  return (
    <Suspense fallback={null}>
      <BackendBeaconCore />
    </Suspense>
  );
}

function BackendBeaconCore() {
  useClashConfig();
  return null;
}
