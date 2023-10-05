import React from 'react';

import { ErrorFallbackLayout } from '$src/components/error/ErrorFallbackLayout';

import { GitHubIcon } from '../icon/GitHubIcon';
import sx from './ErrorBoundaryFallback.module.scss';
const yacdRepoIssueUrl = 'https://github.com/haishanh/yacd/issues';

type Props = {
  message?: string;
  detail?: string;
};

function ErrorBoundaryFallback({ message, detail }: Props) {
  return (
    <ErrorFallbackLayout>
      {message ? <h1>{message}</h1> : null}
      {detail ? <p>{detail}</p> : null}
      <p>
        <a className={sx.link} href={yacdRepoIssueUrl}>
          <GitHubIcon width={16} height={16} />
          haishanh/yacd
        </a>
      </p>
    </ErrorFallbackLayout>
  );
}

export default ErrorBoundaryFallback;
