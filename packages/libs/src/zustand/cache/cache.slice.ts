import { CacheAction, CacheStateCreator } from './cache.modal';

export const cacheStateCreator: CacheStateCreator = (set) => ({
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
