import { StateCreator } from 'zustand';

type CacheState = {
  currentTab: string;
};

type CacheMutations = {
  setCurrentTab: (tab: string) => void;
};

export type CacheStore = CacheState & CacheMutations;

export enum CacheAction {
  SET_CURRENT_TAB = 'setCurrentTab',
}

export type CacheStateCreator = StateCreator<
  CacheStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  CacheStore
>;
