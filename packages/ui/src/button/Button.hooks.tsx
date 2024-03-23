import { ProxyFunc } from './Button.modal';

export function useMouseEventProxy(callback?: ProxyFunc) {
  return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(e.target as HTMLElement, e);
  };
}
