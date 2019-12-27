import React, { PureComponent } from 'react';

import { Zap } from 'react-feather';

import ToggleSwitch from './ToggleSwitch';
import Input from './Input';
import Switch from './Switch';
import Button from './Button';
import { LoadingDot } from './shared/Basic';

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
          <Button text="Test Lxatency" start={<Zap size={16} />} />
          <Button text="Test Lxatency" start={<Zap size={16} />} isLoading />
          <Button label="Test Lxatency" />
          <Button label="Button Plain" kind="minimal" />
        </Pane>
        <Pane style={{ paddingLeft: 20 }}>
          <LoadingDot />
        </Pane>
      </div>
    );
  }
}

export default StyleGuide;
