import * as React from 'react';

// import { getSentry } from '../misc/sentry';
import { deriveMessageFromError, Err } from '../misc/errors';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Err;
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  static getDerivedStateFromError(error: Err) {
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
