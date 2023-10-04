import React from 'react';

import { BackendList } from '$src/components/backend/BackendList';

import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { BackendForm } from './BackendForm';

export function Backend() {
  return (
    <div style={{ margin: '0 auto' }}>
      <BackendForm />
      <Sep />
      <BackendList />
      <div className="fixed left-0 bottom-0" style={{ padding: 16 }}>
        <ThemeSwitcher />
      </div>
    </div>
  );
}

function Sep() {
  return <div style={{ height: 20 }} />;
}
