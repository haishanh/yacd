import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ToggleSwitch from './ToggleSwitch';
import Input from './Input';
import Switch from './Switch';
import Button from './Button';
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

const Pane = ({ children }) => <div style={paneStyle}>{children}</div>;
Pane.propTypes = {
  children: PropTypes.element
};

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
          <Button label="Test Latency" />
        </Pane>
      </div>
    );
  }
}

export default StyleGuide;
