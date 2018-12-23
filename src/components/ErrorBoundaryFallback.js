import React from 'react';
import Icon from 'c/Icon';
import yacd from 's/yacd.svg';
import github from 's/github.svg';

import s0 from './ErrorBoundaryFallback.module.scss';
const yacdRepoIssueUrl = 'https://github.com/haishanh/yacd/issues';

function ErrorBoundaryFallback() {
  return (
    <div className={s0.root}>
      <div className={s0.yacd}>
        <Icon id={yacd.id} width={150} height={150} />
      </div>
      <h1>Oops, something went wrong!</h1>
      <p>
        If you think this is a bug, reporting this at{' '}
        <a className={s0.link} href={yacdRepoIssueUrl}>
          <Icon id={github.id} width={16} height={16} />
          haishanh/yacd
        </a>
      </p>
    </div>
  );
}

export default ErrorBoundaryFallback;
