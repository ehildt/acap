import { createStoreWithImmerPersist } from 'libs';

import { State } from './model';

export const useImmerPersistCacheStore = createStoreWithImmerPersist<State>(
  (set) => ({
    tab: 'metae',
    setTab: (tab) =>
      set((state) => {
        state.tab = tab;
      }),
  }),
  { name: 'cache' },
);
