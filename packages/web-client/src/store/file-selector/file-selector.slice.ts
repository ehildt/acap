import { StateCreator } from 'zustand';

import { FileSelectorSlice, State } from '../state.modal';
import { FileSelectorAction } from './file-selector.model';

type FileSelectorStateCreator = StateCreator<
  State,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  FileSelectorSlice
>;

export const createFileSelectorSlice: FileSelectorStateCreator = (set) => ({
  files: undefined,
  selectFiles: async (files) =>
    set(
      ({ fileSlice }) => {
        // Fetch data here?
        // TODO: check for the same file before adding
        fileSlice.files = fileSlice.files?.concat(files) ?? files;
      },
      false,
      FileSelectorAction.SELECT_FILES,
    ),
});
