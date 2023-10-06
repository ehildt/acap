import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createCacheSlice } from './cache/cache.slice';
import { createFileSelectorSlice } from './file-selector/file-selector.slice';
import { State } from './state.modal';

/**
 * The data is being cache in memory
 */
export const useCacheStore = create<State>()(
  devtools(
    immer((...args) => ({
      cache: createCacheSlice(...args),
      fileSlice: createFileSelectorSlice(...args),
    })),
  ),
);
