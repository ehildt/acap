export function maskString(
  startOffset: number,
  endOffset: number,
  str: string,
) {
  let mask = str.substring(startOffset, endOffset).padEnd(str.length, '*');
  mask = mask.substring(startOffset, str.length - endOffset);
  return `${mask}${str.substring(mask.length)}`;
}
