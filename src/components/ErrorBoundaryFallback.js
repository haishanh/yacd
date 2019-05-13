import React from 'react';
import PropTypes from 'prop-types';
import SvgYacd from './SvgYacd';
import SvgGithub from './SvgGithub';

import s0 from './ErrorBoundaryFallback.module.css';
const yacdRepoIssueUrl = 'https://github.com/haishanh/yacd/issues';

function ErrorBoundaryFallback({ message, detail }) {
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

ErrorBoundaryFallback.propTypes = {
  message: PropTypes.string
};

export default ErrorBoundaryFallback;
