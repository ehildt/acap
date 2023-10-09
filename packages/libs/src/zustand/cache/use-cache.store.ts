import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { CacheStore } from './cache.modal';
import { cacheStateCreator } from './cache.slice';

export const useCacheStore = create<CacheStore>()(devtools(immer((...args) => cacheStateCreator(...args))));
