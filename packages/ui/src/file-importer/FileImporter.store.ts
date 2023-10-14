import { createStoreWithImmer } from 'libs';

type Data = {
  files?: Array<File>;
};

type Mutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
};

export const useFileImporterImmerStore = createStoreWithImmer<Data & Mutations>((set) => ({
  files: undefined,
  selectFiles: async (files) =>
    set((store) => {
      store.files = store.files?.concat(files) ?? files;
    }),
}));
