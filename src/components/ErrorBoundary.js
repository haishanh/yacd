import PropTypes from 'prop-types';
import React, { Component } from 'react';

// import { getSentry } from '../misc/sentry';
import { deriveMessageFromError } from '../misc/errors';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const { message, detail } = deriveMessageFromError(this.state.error);
      return <ErrorBoundaryFallback message={message} detail={detail} />;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
