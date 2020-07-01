import cx from 'clsx';
import { formatDistance } from 'date-fns';
import * as React from 'react';
import { RotateCw } from 'react-feather';
import { queryCache, useMutation } from 'react-query';
import { refreshRuleProviderByName } from 'src/api/rule-provider';
import Button from 'src/components/Button';
import { SectionNameType } from 'src/components/shared/Basic';
import { ClashAPIConfig } from 'src/types';

import s from './RuleProviderItem.module.css';

function useRefresh(
  name: string,
  apiConfig: ClashAPIConfig
): [(ev: React.MouseEvent<HTMLButtonElement>) => unknown, boolean] {
  const [mutate, { isLoading }] = useMutation(refreshRuleProviderByName, {
    onSuccess: () => {
      queryCache.invalidateQueries('/providers/rules');
    },
  });

  const onClickRefreshButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    mutate({ name, apiConfig });
  };

  return [onClickRefreshButton, isLoading];
}

function RotatableRotateCw({ isRotating }: { isRotating: boolean }) {
  const cls = cx(s.rotate, {
    [s.isRotating]: isRotating,
  });
  return (
    <span className={cls}>
      <RotateCw width={16} />
    </span>
  );
}

export function RuleProviderItem({
  idx,
  name,
  vehicleType,
  behavior,
  updatedAt,
  ruleCount,
  apiConfig,
}) {
  const [onClickRefreshButton, isRefreshing] = useRefresh(name, apiConfig);
  const timeAgo = formatDistance(new Date(updatedAt), new Date());
  return (
    <div className={s.RuleProviderItem}>
      <span className={s.left}>{idx}</span>
      <div className={s.middle}>
        <SectionNameType name={name} type={`${vehicleType} / ${behavior}`} />
        <div className={s.gray}>
          {ruleCount < 2 ? `${ruleCount} rule` : `${ruleCount} rules`}
        </div>
        <small className={s.gray}>Updated {timeAgo} ago</small>
      </div>
      <span className={s.refreshButtonWrapper}>
        <Button onClick={onClickRefreshButton} disabled={isRefreshing}>
          <RotatableRotateCw isRotating={isRefreshing} />
        </Button>
      </span>
    </div>
  );
}

