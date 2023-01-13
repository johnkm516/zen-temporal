import * as wf from '@temporalio/workflow'; 

export function useState<T = any>(name: string, initialValue: T) {
    const signal = wf.defineSignal<[T]>(name);
    const query = wf.defineQuery<T>(name);
    let state: T = initialValue;
    wf.setHandler(signal, (newVal: T) => void (newVal = state));
    wf.setHandler(query, () => state);
    return {
      signal,
      query,
      get value() {
        return state;
      },
      set value(newVal: T) {
        state = newVal;
      },
    };
  }