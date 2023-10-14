import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type StoreWithImmerSlice<State> = StateCreator<State, [['zustand/immer', never]], Array<[any, any]>, State>;

export function createStoreWithImmer<State>(initializer: StoreWithImmerSlice<State>) {
  return create<State>()(immer(initializer));
}
