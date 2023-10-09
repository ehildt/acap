import { StateCreator } from "zustand";

export enum FileSelectorAction {
  SELECT_FILES = "selectFiles",
}

export type FileSelectorState = {
  files?: Array<File>;
};

export type FileSelectorMutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
};

export type FileSelectorStore = FileSelectorState & FileSelectorMutations;
export type FileSelectorStateCreator = StateCreator<
  FileSelectorStore,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  FileSelectorStore
>;
