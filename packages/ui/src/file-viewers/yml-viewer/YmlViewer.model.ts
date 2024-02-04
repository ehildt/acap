export type RowProps = {
  className?: string;
  kvPair: { key?: string; value: any };
  separate?: boolean;
};

export type YmlViewerProps = {
  yml: string;
};
