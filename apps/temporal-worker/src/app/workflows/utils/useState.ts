import * as wf from '@temporalio/workflow'; 

export function useState<T = any>(name: string, initialValue: T) {
    const signal = wf.defineSignal<[T]>(name);
    const query = wf.defineQuery<T>(name);
    let state: T = initialValue;
    wf.setHandler(signal, (newValue: T) => {
      console.log("updating ", name, newValue);
      state = newValue;
    });
    wf.setHandler(query, () => state);
    return {
      signal,
      query,
      get value() {
        // need to use closure because function doesn't rerun unlike React Hooks
        return state;
      },
      set value(newVal: T) {
        state = newVal;
      },
    };
  }