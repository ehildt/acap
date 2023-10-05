export function useMouseMove(ref: any, elem: any) {
  const rect = ref?.current?.getBoundingClientRect();
  const x = elem?.clientX - rect.left;
  const y = elem?.clientY - rect.top;
  ref?.current?.style.setProperty('--xPos', `${x}px`);
  ref?.current?.style.setProperty('--yPos', `${y}px`);
}
