import React from 'react';
import type { FallbackProps } from 'react-error-boundary';

import {
  deriveMessageFromError,
  YacdBackendGeneralError,
  YacdBackendUnauthorizedError,
  YacdFetchNetworkError,
} from '$src/misc/errors';

import {
  BackendGeneralErrorFallback,
  BackendUnauthorizedErrorFallback,
  FetchNetworkErrorFallback,
} from './BackendErrorFallback';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof YacdFetchNetworkError) {
    return <FetchNetworkErrorFallback ctx={error.ctx} resetErrorBoundary={resetErrorBoundary} />;
  }

  if (error instanceof YacdBackendUnauthorizedError) {
    return (
      <BackendUnauthorizedErrorFallback ctx={error.ctx} resetErrorBoundary={resetErrorBoundary} />
    );
  }

  if (error instanceof YacdBackendGeneralError) {
    return <BackendGeneralErrorFallback ctx={error.ctx} resetErrorBoundary={resetErrorBoundary} />;
  }

  const { message, detail } = deriveMessageFromError(error);
  return <ErrorBoundaryFallback message={message} detail={detail} />;
}
