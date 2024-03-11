import { createStoreWithImmer } from 'libs';

type Data = {
  pages: number;
  currentPage: number;
};

type Mutations = {
  setPages: (pages: number) => void;
  setCurrentPage: (currentPage: number) => void;
};

export const usePdfViewImmerStore = createStoreWithImmer<Data & Mutations>((set) => ({
  pages: 0,
  currentPage: 1,
  setPages: (pages) =>
    set((store) => {
      if (pages) store.pages = pages;
    }),
  setCurrentPage: (currentPage) =>
    set((store) => {
      if (currentPage) store.currentPage = currentPage;
    }),
}));
