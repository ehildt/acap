import { createStoreWithImmer } from 'libs';

type Data = {
  files?: Array<File>;
  toggleTreeView: boolean;
};

type Mutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
  setToggleTreeView: () => Promise<void>;
};

export const useFileImporterImmerStore = createStoreWithImmer<Data & Mutations>((set) => ({
  files: undefined,
  toggleTreeView: false,
  setToggleTreeView: async () => {
    set((store) => {
      store.toggleTreeView = !store.toggleTreeView;
    });
  },
  selectFiles: async (files) =>
    set((store) => {
      store.files = store.files?.concat(files) ?? files;
    }),
}));
