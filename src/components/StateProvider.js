import React from 'react';
import produce, * as immer from 'immer';

const {
  createContext,
  memo,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useState
} = React;

const StateContext = createContext(null);
const DispatchContext = createContext(null);

export { immer };

export function useStoreState() {
  return useContext(StateContext);
}

export function useStoreDispatch() {
  return useContext(DispatchContext);
}

export default function Provider({ initialState, children }) {
  const stateRef = useRef(initialState);
  const [state, setState] = useState(initialState);
  const getState = useCallback(() => stateRef.current, []);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.getState2 = getState;
    }
  }, [getState]);
  const dispatch = useCallback(
    (actionId, fn, thunk) => {
      // if (thunk) return thunk(dispatch, getState);
      if (typeof actionId === 'function') return actionId(dispatch, getState);

      const stateNext = produce(getState(), fn);
      if (stateNext !== stateRef.current) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(actionId, stateNext);
        }
        stateRef.current = stateNext;
        setState(stateNext);
      }
    },
    [getState]
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function connect(mapStateToProps) {
  return Component => {
    const MemoComponent = memo(Component);
    function Connected(props) {
      const state = useContext(StateContext);
      const dispatch = useContext(DispatchContext);
      const mapped = mapStateToProps(state, props);
      const nextProps = {
        ...props,
        ...mapped,
        dispatch
      };
      return <MemoComponent {...nextProps} />;
    }
    return Connected;
  };
}
