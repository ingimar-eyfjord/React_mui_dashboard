import { debounce } from 'lodash';
import { useCallback, useRef } from 'react';

type Callback = (...args: any[]) => void;

/**
 * Create the memoized / debounced function one time.
 *
 * This stores the current instance of the function to be debounced in a ref and updates
 * it every render (preventing stale data). Instead of debouncing that function directly we
 * debounce a wrapper function that reads the current version from the ref and call that.
 */
export function useDebouncedCallback(callback: Callback, delay: number) {
  const callbackRef = useRef<Callback>();
  callbackRef.current = callback;
  // eslint-disable-next-line
  return useCallback(
    debounce((...args) => callbackRef.current?.(...args), delay),
    []
  );
}

// Usage
// const onChange = useDebouncedCallback((val: string) => {
//   }, 300);

//   return (
//     <input type="text" onChange={onChange} />
//   )