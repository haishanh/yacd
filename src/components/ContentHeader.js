import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from './ContentHeader.module.scss';

class ContentHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={s0.root}>
        <h1 className={s0.h1}>{this.props.title}</h1>
      </div>
    );
  }
}

export default ContentHeader;
