import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateAllRuleProviderItems } from 'src/components/rules/rules.hooks';
import { Fab, position as fabPosition } from 'src/components/shared/Fab';
import { RotateIcon } from 'src/components/shared/RotateIcon';
import { ClashAPIConfig } from 'src/types';

type RulesPageFabProps = {
  apiConfig: ClashAPIConfig;
};

export function RulesPageFab({ apiConfig }: RulesPageFabProps) {
  const [update, isLoading] = useUpdateAllRuleProviderItems(apiConfig);
  const { t } = useTranslation();
  return (
    <Fab
      icon={<RotateIcon isRotating={isLoading} />}
      text={t('update_all_rule_provider')}
      style={fabPosition}
      onClick={update}
    />
  );
}
