import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ToggleSwitch from 'c/ToggleSwitch';
import Input from 'c/Input';
import Switch from 'c/Switch';
import Button from 'c/Button';
// import Modal from 'c/Modal';
// import APIConfig from 'c/APIConfig';
import Proxy2 from 'c/Proxy2';

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
          <Proxy2 />
        </Pane>
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
