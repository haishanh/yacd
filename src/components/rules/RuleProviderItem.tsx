import { formatDistance } from 'date-fns';
import * as React from 'react';
import Button from 'src/components/Button';
import { useUpdateRuleProviderItem } from 'src/components/rules/rules.hooks';
import { SectionNameType } from 'src/components/shared/Basic';
import { RotateIcon } from 'src/components/shared/RotateIcon';

import { ClashAPIConfig } from '$src/types';

import s from './RuleProviderItem.module.scss';

export function RuleProviderItem({
  idx,
  name,
  vehicleType,
  behavior,
  updatedAt,
  ruleCount,
  apiConfig,
}: {
  idx: number;
  name: string;
  vehicleType: string;
  behavior: string;
  updatedAt: string;
  ruleCount: number;
  apiConfig: ClashAPIConfig;
}) {
  const [onClickRefreshButton, isRefreshing] = useUpdateRuleProviderItem(name, apiConfig);
  const timeAgo = formatDistance(new Date(updatedAt), new Date());
  return (
    <div className={s.RuleProviderItem}>
      <span className={s.left}>{idx}</span>
      <div className={s.middle}>
        <SectionNameType name={name} type={`${vehicleType} / ${behavior}`} />
        <div className={s.gray}>{ruleCount < 2 ? `${ruleCount} rule` : `${ruleCount} rules`}</div>
        <div className={s.action}>
          <Button onClick={onClickRefreshButton} disabled={isRefreshing} className={s.refreshBtn}>
            <RotateIcon isRotating={isRefreshing} size={13} />
            <span className="visually-hidden">Refresh</span>
          </Button>
          <small className={s.gray}>Updated {timeAgo} ago</small>
        </div>
      </div>
    </div>
  );
}
