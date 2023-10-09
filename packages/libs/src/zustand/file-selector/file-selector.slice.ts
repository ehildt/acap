import {
  FileSelectorAction,
  FileSelectorStateCreator,
} from "./file-selector.model";

export const fileSelectorStateCreator: FileSelectorStateCreator = (set) => ({
  files: undefined,
  selectFiles: async (files) =>
    set(
      ({ fileSlice }) => {
        // Fetch data here?
        // TODO: check for the same file before adding
        fileSlice.files = fileSlice.files?.concat(files) ?? files;
      },
      false,
      FileSelectorAction.SELECT_FILES
    ),
});
