import React, { PureComponent } from 'react';

import { Zap } from 'react-feather';

import SwitchThemed from './SwitchThemed';
import ToggleSwitch from './ToggleSwitch';
import Input from './Input';
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

function useToggle(initialState = false) {
  const [onoff, setonoff] = React.useState(initialState);
  const handleChange = React.useCallback(() => {
    setonoff(x => !x);
  }, []);
  return [onoff, handleChange];
}

function SwitchExample() {
  const [checked, handleChange] = useToggle(false);
  return <SwitchThemed checked={checked} onChange={handleChange} />;
}

class StyleGuide extends PureComponent {
  render() {
    return (
      <div>
        <Pane>
          <SwitchExample />
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
