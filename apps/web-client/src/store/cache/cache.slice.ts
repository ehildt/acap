import { StateCreator } from 'zustand';

import { CacheSlice, State } from '../state.modal';
import { CacheAction } from './cache.modal';

type CacheStateCreator = StateCreator<State, [['zustand/immer', never], ['zustand/devtools', never]], [], CacheSlice>;

export const createCacheSlice: CacheStateCreator = (set) => ({
  currentTab: 'edit',
  setCurrentTab: (tab) =>
    set(
      ({ cache }) => {
        cache.currentTab = tab;
      },
      false,
      CacheAction.SET_CURRENT_TAB,
    ),
});
