export enum FileSelectorAction {
  SELECT_FILES = 'selectFiles',
}

export type FileSelectorState = {
  files?: Array<File>;
};

export type FileSelectorMutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
};
