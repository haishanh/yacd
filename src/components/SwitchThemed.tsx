import React from 'react';
import S from 'react-switch';

import { getTheme } from '../store/app';
import { connect } from './StateProvider';

// workaround https://github.com/vitejs/vite/issues/2139#issuecomment-802981228
const Switch = S.default ? S.default : S;

function SwitchThemed({ checked = false, onChange, theme, name }) {
  const offColor = theme === 'dark' ? '#393939' : '#e9e9e9';

  return (
    <Switch
      onChange={onChange}
      checked={checked}
      uncheckedIcon={false}
      checkedIcon={false}
      offColor={offColor}
      onColor="#047aff"
      offHandleColor="#fff"
      onHandleColor="#fff"
      handleDiameter={24}
      height={28}
      width={44}
      className="rs"
      name={name}
    />
  );
}

export default connect((s) => ({
  theme: getTheme(s),
}))(SwitchThemed);
