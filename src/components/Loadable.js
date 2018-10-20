import L from 'react-loadable';

import Loading from './Loading';

// error will passed if the component failed to load
// const Loading = ({ error }) => <div>loading</div>;

const Loadable = opts =>
  L({
    loading: Loading,
    delay: 200,
    ...opts
  });

export default Loadable;
