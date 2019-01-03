import React, { useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';

import ContentHeader from 'c/ContentHeader';
import Rule from 'c/Rule';

import { getRules, fetchRules } from 'd/rules';

const mapStateToProps = s => ({
  rules: getRules(s)
});

const actions = {
  fetchRules
};

export default function Rules() {
  const { fetchRules } = useActions(actions);
  useEffect(() => {
    fetchRules();
  }, []);
  const { rules } = useStoreState(mapStateToProps);

  return (
    <div>
      <ContentHeader title="Rules" />
      <div style={{ paddingBottom: 30 }}>
        {rules.map(r => {
          return <Rule key={r.id} {...r} />;
        })}
      </div>
    </div>
  );
}
