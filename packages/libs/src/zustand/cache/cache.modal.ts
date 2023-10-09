import { StateCreator } from 'zustand';

export enum CacheAction {
  SET_CURRENT_TAB = 'setCurrentTab',
}

export type CacheState = {
  currentTab: string;
};

export type CacheMutations = {
  setCurrentTab: (tab: string) => void;
};

export type CacheStore = CacheState & CacheMutations;
export type CacheStateCreator = StateCreator<
  CacheStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  CacheStore
>;
