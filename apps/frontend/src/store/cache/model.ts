export type State = Data & Mutations;

export type Data = {
  tab: string;
};

export type Mutations = {
  setTab: (tab: string) => void;
};
