import { Container } from '@/container/Container';

import { JsonViewerProps } from './JsonViewer.model';
import { JsonViewerRow } from './JsonViewerRow';

export function JsonViewer(props: JsonViewerProps) {
  return (
    <Container>
      <JsonViewerRow kvPair={{ value: JSON.parse(props.json) }} />
    </Container>
  );
}
