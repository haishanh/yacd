import * as React from 'react';
import ReactSwitch from 'react-switch';

import { State } from '$src/store/types';

import { getTheme } from '../store/app';
import { connect } from './StateProvider';

// workaround https://github.com/vitejs/vite/issues/2139#issuecomment-802981228
// @ts-ignore
const Switch = ReactSwitch.default ? ReactSwitch.default : ReactSwitch;

function SwitchThemed({ checked = false, onChange, theme, name }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  theme: string;
  name: string;
}) {
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

export default connect((s: State) => ({ theme: getTheme(s) }))(SwitchThemed);
