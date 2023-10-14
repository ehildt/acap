import { createStoreWithImmerPersist } from 'libs';

import { State } from './model';

export const useImmerPersistCacheStore = createStoreWithImmerPersist<State>(
  (set) => ({
    tab: 'edit',
    setTab: (tab) => set((state) => (state.tab = tab)),
  }),
  { name: 'cache' },
);
