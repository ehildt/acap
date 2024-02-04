import { parse } from 'yaml';

import { Container } from '@/container/Container';

import { YmlViewerProps } from './YmlViewer.model';
import { YmlViewerRow } from './YmlViewerRow';

export function YmlViewer(props: YmlViewerProps) {
  const obj = parse(props.yml);

  return (
    <Container>
      <YmlViewerRow kvPair={{ value: obj }} />
    </Container>
  );
}
