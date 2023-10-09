import { StateCreator } from 'zustand';

type FileSelectorState = {
  files?: Array<File>;
};

type FileSelectorMutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
};

export type FileSelectorStore = FileSelectorState & FileSelectorMutations;

export enum FileSelectorAction {
  SELECT_FILES = 'selectFiles',
}

export type FileSelectorStateCreator = StateCreator<
  FileSelectorStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  FileSelectorStore
>;
