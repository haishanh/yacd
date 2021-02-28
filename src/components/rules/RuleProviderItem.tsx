import { formatDistance } from 'date-fns';
import * as React from 'react';
import Button from 'src/components/Button';
import { RotateIcon } from 'src/components/rules/RotateIcon';
import { useUpdateRuleProviderItem } from 'src/components/rules/rules.hooks';
import { SectionNameType } from 'src/components/shared/Basic';

import s from './RuleProviderItem.module.css';

export function RuleProviderItem({
  idx,
  name,
  vehicleType,
  behavior,
  updatedAt,
  ruleCount,
  apiConfig,
}) {
  const [onClickRefreshButton, isRefreshing] = useUpdateRuleProviderItem(
    name,
    apiConfig
  );
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
          <RotateIcon isRotating={isRefreshing} />
        </Button>
      </span>
    </div>
  );
}
