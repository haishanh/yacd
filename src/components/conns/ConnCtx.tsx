import * as React from 'react';

const ref = {
  hasProcessPath: false,
};

export const MutableConnRefCtx = React.createContext(ref);
