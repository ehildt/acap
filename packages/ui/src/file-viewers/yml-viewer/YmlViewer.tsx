import { Container } from '@/container/Container';

import { YmlViewerProps } from './YmlViewer.model';
import { YmlViewerRow } from './YmlViewerRow';

export function YmlViewer(props: YmlViewerProps) {
  return (
    <Container>
      <YmlViewerRow kvPair={{ value: props.yml }} />
    </Container>
  );
}
