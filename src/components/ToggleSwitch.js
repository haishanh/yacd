import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/ToggleSwitch.module.scss';

class ToggleSwitch extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    options: [
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
    ],
    value: 'Rule',
    name: 'rand0'
  };

  // handleRadioOnChange = ev => {
  //   ev.preventDefault();
  //   const value = ev.target.value;
  //   if (this.state.value === value) return;
  //   this.setState({ value });
  // };

  render() {
    const { options, name, value, onChange } = this.props;
    const w = (100 / options.length).toPrecision(3);
    return (
      <div>
        <div className={s0.ToggleSwitch}>
          {options.map((o, idx) => {
            if (value === o.value) this.idx = idx;
            const id = `${name}-${o.label}`;
            let className = idx === 0 ? '' : 'border-left';
            return (
              <label htmlFor={id} key={id} className={className}>
                <input
                  id={id}
                  name={name}
                  type="radio"
                  value={o.value}
                  checked={value === o.value}
                  onChange={onChange}
                />
                <div>{o.label}</div>
              </label>
            );
          })}
          <a
            className={s0.slider}
            style={{
              width: w + '%',
              left: this.idx * w + '%'
            }}
          />
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;
