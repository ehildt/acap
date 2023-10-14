export type SelectedBoxProps = {
  customInput: boolean;
  defaultIndex: number;
  onClick: (value: string) => void;
  items: Array<{ name: string; value: number | string }>;
};
