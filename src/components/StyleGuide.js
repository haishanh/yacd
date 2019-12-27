import React, { PureComponent } from 'react';

import { Zap } from 'react-feather';

import ToggleSwitch from './ToggleSwitch';
import Input from './Input';
import Switch from './Switch';
import Button, { ButtonWithIcon, ButtonPlain } from './Button';
// import Modal from 'c/Modal';
// import APIConfig from 'c/APIConfig';
// import Proxy from 'c/Proxy';

const paneStyle = {
  padding: '20px 0'
};

const optionsRule = [
  {
    label: 'Global',
    value: 'Global'
  },
  {
    label: 'Rule',
    value: 'Rule'
  },
  {
    label: 'Direct',
    value: 'Direct'
  }
];

const Pane = ({ children, style }) => (
  <div style={{ ...paneStyle, ...style }}>{children}</div>
);

class StyleGuide extends PureComponent {
  render() {
    return (
      <div>
        <Pane>
          <Switch />
        </Pane>
        <Pane>
          <Input />
        </Pane>
        <Pane>
          <ToggleSwitch
            name="test"
            options={optionsRule}
            value="Rule"
            onChange={() => {}}
          />
        </Pane>
        <Pane>
          <Button label="Test Lxatency" />
          <Button text="Test Lxatency" start={<Zap size={17} />} />
          <ButtonPlain label="Plain" />
        </Pane>
        <Pane style={{ paddingLeft: 20 }}>
          <div className="dot_loading dot_loading_white" />
        </Pane>
      </div>
    );
  }
}

export default StyleGuide;
