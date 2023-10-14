import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type StoreWithPersistImmerSlice<State> = StateCreator<
  State,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  Array<[any, any]>,
  State
>;

export function createStoreWithImmerPersist<State>(
  initializer: StoreWithPersistImmerSlice<State>,
  options: PersistOptions<State, State>,
) {
  return create<State>()(immer(persist(initializer, options)));
}
