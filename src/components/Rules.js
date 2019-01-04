import React, { useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';
import Button from 'c/Button';

import ContentHeader from 'c/ContentHeader';
import Rule from 'c/Rule';
import RuleSearch from 'c/RuleSearch';

import { getRules, fetchRulesOnce } from 'd/rules';

import s0 from './Rules.module.scss';

const mapStateToProps = s => ({
  rules: getRules(s)
});

const actions = {
  fetchRulesOnce
};

export default function Rules() {
  const { fetchRulesOnce } = useActions(actions);
  useEffect(() => {
    fetchRulesOnce();
  }, []);
  const { rules } = useStoreState(mapStateToProps);

  return (
    <div>
      <ContentHeader title="Rules" />
      <RuleSearch />
      <div style={{ paddingBottom: 30 }}>
        {rules.map(r => {
          return <Rule key={r.id} {...r} />;
        })}
      </div>
      <div className={s0.fabgrp}>
        <Button label="Refresh" onClick={() => {}} />
      </div>
    </div>
  );
}
