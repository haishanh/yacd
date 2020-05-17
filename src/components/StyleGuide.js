import React, { PureComponent } from 'react';

import { Zap } from 'react-feather';

import Select from './shared/Select';
import SwitchThemed from './SwitchThemed';
import ToggleSwitch from './ToggleSwitch';
import Input from './Input';
import Button from './Button';
import { LoadingDot } from './shared/Basic';

const noop = () => {
  /* empty */
};

const paneStyle = {
  padding: '20px 0',
};

const optionsRule = [
  {
    label: 'Global',
    value: 'Global',
  },
  {
    label: 'Rule',
    value: 'Rule',
  },
  {
    label: 'Direct',
    value: 'Direct',
  },
];

const options = [
  ['Natural', 'Original order in config file'],
  ['LatencyAsc', 'By latency from small to big'],
  ['LatencyDesc', 'By latency from big to small'],
  ['NameAsc', 'By name alphabetically (A-Z)'],
  ['NameDesc', 'By name alphabetically (Z-A)'],
];

const Pane = ({ children, style }) => (
  <div style={{ ...paneStyle, ...style }}>{children}</div>
);

function useToggle(initialState = false) {
  const [onoff, setonoff] = React.useState(initialState);
  const handleChange = React.useCallback(() => {
    setonoff((x) => !x);
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
          <Select options={options} selected={'Natural'} onChange={noop} />
        </Pane>
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
            onChange={noop}
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
