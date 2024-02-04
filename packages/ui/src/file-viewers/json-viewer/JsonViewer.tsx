import { Container } from '@/container/Container';

import { JsonViewerProps } from './JsonViewer.model';
import { JsonViewerRow } from './JsonViewerRow';

export function JsonViewer(props: JsonViewerProps) {
  const obj = JSON.parse(props.json);
  console.log({ obj });
  return (
    <Container>
      <JsonViewerRow kvPair={{ value: obj }} />
    </Container>
  );
}
