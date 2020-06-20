import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { deriveMessageFromError } from '../misc/errors';
import { getSentry } from '../misc/sentry';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

// XXX this is no Hook equivalents for componentDidCatch
// we have to use class for now

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = { error: null };

  loadSentry = async () => {
    if (this.sentry) return this.sentry;
    const x = await getSentry();
    this.sentry = x;
    return this.sentry;
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidMount() {
    // this.loadSentry();
  }

  componentDidCatch(error, _info) {
    this.setState({ error });
    // eslint-disable-next-line no-console
    // console.log(error, errorInfo);
    // this.setState({ error });
    // this.loadSentry().then(Sentry => {
    //   Sentry.withScope(scope => {
    //     Object.keys(errorInfo).forEach(key => {
    //       scope.setExtra(key, errorInfo[key]);
    //     });
    //     Sentry.captureException(error);
    //   });
    // });
  }

  showReportDialog = () => {
    this.loadSentry().then((Sentry) => Sentry.showReportDialog());
  };

  render() {
    if (this.state.error) {
      const { message, detail } = deriveMessageFromError(this.state.error);
      //render fallback UI
      return <ErrorBoundaryFallback message={message} detail={detail} />;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
