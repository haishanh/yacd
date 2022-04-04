import * as React from 'react';
import ContentHeader from 'src/components/ContentHeader';
import { ProxyProvider } from 'src/components/proxies/ProxyProvider';
import { FormattedProxyProvider } from 'src/store/types';
import { useTranslation } from 'react-i18next';

export function ProxyProviderList({
  items,
}: {
  items: FormattedProxyProvider[];
}) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <>
      <ContentHeader title={t('proxy_provider')} />
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
