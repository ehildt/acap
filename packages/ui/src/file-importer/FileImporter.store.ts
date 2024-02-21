import { createStoreWithImmer } from 'libs';

type Data = {
  toggleLeafNodeValues: boolean;
  files?: Array<File>;
  toggleTreeView: boolean;
};

type Mutations = {
  selectFiles: (files: Array<File>) => Promise<void>;
  setToggleTreeView: () => Promise<void>;
  setToggleLeafNodeValues: () => Promise<void>;
};

export const useFileImporterImmerStore = createStoreWithImmer<Data & Mutations>((set) => ({
  files: undefined,
  toggleLeafNodeValues: false,
  toggleTreeView: false,
  setToggleTreeView: async () => {
    set((store) => {
      store.toggleTreeView = !store.toggleTreeView;
    });
  },
  setToggleLeafNodeValues: async () => {
    set((store) => {
      store.toggleLeafNodeValues = !store.toggleLeafNodeValues;
    });
  },
  selectFiles: async (files) =>
    set((store) => {
      store.files = store.files?.concat(files) ?? files;
    }),
}));
