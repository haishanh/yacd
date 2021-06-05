import React from 'react';

import s0 from './ErrorBoundaryFallback.module.scss';
import SvgGithub from './SvgGithub';
import SvgYacd from './SvgYacd';
const yacdRepoIssueUrl = 'https://github.com/haishanh/yacd/issues';

type Props = {
  message?: string;
  detail?: string;
};

function ErrorBoundaryFallback({ message, detail }: Props) {
  return (
    <div className={s0.root}>
      <div className={s0.yacd}>
        <SvgYacd width={150} height={150} />
      </div>
      {message ? <h1>{message}</h1> : null}
      {detail ? <p>{detail}</p> : null}
      <p>
        <a className={s0.link} href={yacdRepoIssueUrl}>
          <SvgGithub width={16} height={16} />
          haishanh/yacd
        </a>
      </p>
    </div>
  );
}

export default ErrorBoundaryFallback;
