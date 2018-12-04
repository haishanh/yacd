import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useComponentState } from 'm/store';

import { getTheme } from 'd/app';

import s0 from './Theme.module.scss';

const mapStateToProps = s => ({ theme: getTheme(s) });

function Theme({ children }) {
  const { theme } = useComponentState(mapStateToProps);
  const className = theme === 'dark' ? s0.dark : s0.light;
  return <div className={className}>{children}</div>;
}

export default memo(Theme);
