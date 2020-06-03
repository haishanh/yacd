import * as React from 'react';

import ContentHeader from '../ContentHeader';
import { ProxyProvider } from './ProxyProvider';

export function ProxyProviderList({ items }) {
  if (items.length === 0) return null;

  return (
    <>
      <ContentHeader title="Proxy Provider" />
      <div>
        {items.map((item) => (
          <ProxyProvider
            key={item.name}
            name={item.name}
            proxies={item.proxies}
            type={item.type}
            vehicleType={item.vehicleType}
            updatedAt={item.updatedAt}
          />
        ))}
      </div>
    </>
  );
}
