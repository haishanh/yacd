import React, { useCallback } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SimplifiedResponse } from '$src/api/fetch';
import { FetchCtx } from '$src/types';

import Button from '../Button';
import { Sep } from '../shared/Basic';
import { ErrorFallbackLayout } from './ErrorFallbackLayout';

function useStuff(resetErrorBoundary: FallbackProps['resetErrorBoundary']) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetErrorBoundary();
      navigate('/backend');
    },
    [navigate, resetErrorBoundary],
  );
  return { t, onClick };
}

export function FetchNetworkErrorFallback(props: {
  ctx: FetchCtx;
  resetErrorBoundary: FallbackProps['resetErrorBoundary'];
}) {
  const { resetErrorBoundary, ctx } = props;
  const { t, onClick } = useStuff(resetErrorBoundary);
  return (
    <ErrorFallbackLayout>
      <p>Failed to connect to the backend {ctx.apiConfig.baseURL}</p>
      <Sep />
      <Button onClick={onClick}>{t('switch_backend')}</Button>
    </ErrorFallbackLayout>
  );
}

export function BackendUnauthorizedErrorFallback(props: {
  ctx: FetchCtx;
  resetErrorBoundary: FallbackProps['resetErrorBoundary'];
}) {
  const { resetErrorBoundary, ctx } = props;
  const { t, onClick } = useStuff(resetErrorBoundary);
  return (
    <ErrorFallbackLayout>
      <p>Unauthorized to connect to the backend {ctx.apiConfig.baseURL}</p>
      {ctx.apiConfig.secret ? (
        <p>You might using a wrong secret</p>
      ) : (
        <p>You probably need to provide a secret</p>
      )}
      <Sep />
      <Button onClick={onClick}>{t('switch_backend')}</Button>
    </ErrorFallbackLayout>
  );
}

export function BackendGeneralErrorFallback(props: {
  ctx: FetchCtx & { response: SimplifiedResponse };
  resetErrorBoundary: FallbackProps['resetErrorBoundary'];
}) {
  const { resetErrorBoundary, ctx } = props;
  const { t, onClick } = useStuff(resetErrorBoundary);
  const { response } = ctx;
  return (
    <ErrorFallbackLayout>
      <p>Unexpected response from the backend {ctx.apiConfig.baseURL}</p>
      <Sep />
      <Button onClick={onClick}>{t('switch_backend')}</Button>
      <Sep />
      <div className="text-left mx-auto" style={{ maxWidth: 800 }}>
        <h3 className="font-bold my-2 sm:truncate sm:text-m">Response Status</h3>
        <p>{response.status}</p>
        <h3 className="font-bold my-2 sm:truncate sm:text-m">Response Headers</h3>
        <ul>
          {response.headers.map((h) => {
            return <li key={h}>{h}</li>;
          })}
        </ul>
        {response.data ? (
          <>
            <h3 className="font-bold my-2 sm:truncate sm:text-m">Response Body</h3>
            <pre>{response.data}</pre>
          </>
        ) : null}
      </div>
    </ErrorFallbackLayout>
  );
}
