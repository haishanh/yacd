import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSentry } from '../misc/sentry';
import ErrorBoundaryFallback from 'c/ErrorBoundaryFallback';

// XXX this is no Hook equivalents for componentDidCatch
// we have to use class for now

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = { error: null };

  loadSentry = async () => {
    if (this.sentry) return this.sentry;
    const x = await getSentry();
    this.sentry = x;
    return this.sentry;
  };

  componentDidMount() {
    this.loadSentry();
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    this.loadSentry().then(Sentry => {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    });
  }

  showReportDialog = () => {
    this.loadSentry().then(Sentry => Sentry.showReportDialog());
  };

  render() {
    if (this.state.error) {
      //render fallback UI
      // return <a onClick={this.showReportDialog}>Report feedback</a>;
      return <ErrorBoundaryFallback />;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
