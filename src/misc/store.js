import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import shallowEqual from './shallowEqual';

const StoreContext = createContext(null);

export function Provider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

Provider.propTypes = {
  store: PropTypes.object,
  children: PropTypes.node
};

export function useStore() {
  // return the context
  // which is the redux store
  return useContext(StoreContext);
}

function bindActions(actions, dispatch) {
  const a = typeof actions === 'function' ? actions() : actions;
  return bindActionCreators(a, dispatch);
}

export function useActions(actions) {
  const { dispatch } = useStore();
  return useMemo(() => bindActions(actions, dispatch), [actions, dispatch]);
}

export function useStoreState(selector) {
  const store = useStore();
  const initialMappedState = selector(store.getState());
  const [compState, setCompState] = useState(initialMappedState);
  // subscribe to store change
  useEffect(() => {
    let compStateCurr = compState;
    return store.subscribe(() => {
      const compStateNext = selector(store.getState());
      if (shallowEqual(compStateCurr, compStateNext)) return;
      // update state if not equal
      compStateCurr = compStateNext;
      setCompState(compStateNext);
    });
  }, [compState, selector, store]);
  return compState;
}
