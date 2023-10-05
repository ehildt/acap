export function useIsFileSizeExceeded(maxFileSize: number, files?: Array<File>) {
  return Boolean(files?.filter(({ size }) => size > maxFileSize).length);
}
