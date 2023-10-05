import React from 'react';

import { BackendList } from '$src/components/backend/BackendList';

import { Sep } from '../shared/Basic';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { BackendForm } from './BackendForm';

export function Backend() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      <div className="my-0 mx-auto max-w-3xl p-4 min-h-screen">
        <BackendForm />
        <Sep />
        <BackendList />
        <div className="fixed left-0 bottom-0" style={{ padding: 16 }}>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
