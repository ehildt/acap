export function useIsFileSizeExceeded(maxFileSize: number, files?: Array<File>) {
  return Boolean(files?.filter(({ size }) => size > maxFileSize).length);
}

export function useImageRenderer(f: any, ref: any) {
  if (!ref.current) return;
  const img = new Image();
  img.src = `data:${f.mimeType};base64,${f.buffer.toString('base64')}`;
  img.onload = () => {
    const ctx = ref.current?.getContext('2d', { willReadFrequently: true });
    ref.current.width = img.naturalWidth;
    ref.current.height = img.naturalHeight;
    ctx?.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, ref.current.width, ref.current.height);
  };
}
