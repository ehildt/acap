import { ChangeEvent } from 'react';

import { ProxyOnChange } from './FileSelector.modal';

export function useChangeEventProxy(callback?: ProxyOnChange) {
  return async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.target.files?.length) return;
    await callback?.({ element: e, target: e.target, files: Array.from(e.target.files) });
  };
}
