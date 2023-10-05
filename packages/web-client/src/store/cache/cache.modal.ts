export enum CacheAction {
  SET_CURRENT_TAB = 'setCurrentTab',
}

export type CacheState = {
  currentTab: string;
};

export type CacheMutations = {
  setCurrentTab: (tab: string) => void;
};
