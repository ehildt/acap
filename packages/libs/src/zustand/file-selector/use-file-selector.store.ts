import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { FileSelectorStore } from './file-selector.model';
import { fileSelectorStateCreator } from './file-selector.slice';

export const useFileSelectorStore = create<FileSelectorStore>()(
  devtools(immer((...args) => fileSelectorStateCreator(...args))),
);
