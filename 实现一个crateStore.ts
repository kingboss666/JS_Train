export function createStore(reducer, initialState, middleFunc) {
  if (initialState && typeof initialState === "function") {
    middleFunc = initialState;
    initialState = undefined;
  }

  let currentState = initialState;
  const listeners = [];

  if (middleFunc && typeof middleFunc === "function") {
    // 映射dispatch
    return middleFunc(createStore)(reducer, initialState);
  }

  const getState = () => {
    return currentState;
  };

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    listeners.forEach((listener) => {
      listener();
    });
  };

  const subcribe = (listener) => {
    listeners.push(listener);
  };

  return {
    getState,
    dispatch,
    subcribe,
  };
}
