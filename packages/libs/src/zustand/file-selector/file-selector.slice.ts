import { FileSelectorAction, FileSelectorStateCreator } from './file-selector.model';

export const fileSelectorStateCreator: FileSelectorStateCreator = (set) => ({
  files: undefined,
  selectFiles: async (files) =>
    set(
      (store) => {
        // Fetch data here?
        // TODO: check for the same file before adding
        store.files = store.files?.concat(files) ?? files;
      },
      false,
      FileSelectorAction.SELECT_FILES,
    ),
});
