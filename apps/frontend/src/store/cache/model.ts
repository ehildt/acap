export type State = Data & Mutations;

export type Data = {
  tab: 'edit' | 'metae' | 'files';
};

export type Mutations = {
  setTab: (tab: 'edit' | 'metae' | 'files') => void;
};
