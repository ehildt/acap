import { CacheMutations, CacheState } from './cache/cache.modal';
import { FileSelectorMutations, FileSelectorState } from './file-selector/file-selector.model';

export type CacheSlice = CacheState & CacheMutations;
export type FileSelectorSlice = FileSelectorState & FileSelectorMutations;

export interface State {
  cache: CacheSlice;
  fileSlice: FileSelectorSlice;
}
