import { useEffect, useRef } from 'react';

import style from './ImageViewer.module.scss';

type ImageViewerProps = {
  base64: string;
  mimeType: string;
};

export function ImageViewer(props: ImageViewerProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const target = ref.current;
      const img = new Image();
      img.src = `data:${props.mimeType};base64,${props.base64}`;
      img.onload = () => {
        const ctx = target?.getContext('2d', { willReadFrequently: true });
        target.width = img.naturalWidth;
        target.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, target.width, target.height);
      };
    }
  }, [props.base64]);

  return <canvas ref={ref} className={style.imageViewer} />;
}
