import React from 'react';

import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import APIConfig from './APIConfig';

export function Backend() {
  return (
    <>
      <APIConfig />
      <div
        style={{
          position: 'fixed',
          padding: 16,
          left: 0,
          bottom: 0,
        }}
      >
        <ThemeSwitcher />
      </div>
    </>
  );
}
