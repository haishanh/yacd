import React from 'react';

import ContentHeader from './ContentHeader';
import ProxyProvider from './ProxyProvider';

function ProxyProviderList({ items }) {
  return (
    <>
      <ContentHeader title="Proxy Provider" />
      <div>
        {items.map(item => (
          <ProxyProvider key={item.name} item={item} />
        ))}
      </div>
    </>
  );
}

export default ProxyProviderList;
