import { formatDistanceToNow } from 'date-fns';
import { FaClock, FaClockRotateLeft, FaListUl } from 'react-icons/fa6';

export type MetaeItemProps = {
  metae: Record<string, any>;
};

export function MetaeItem(props: MetaeItemProps) {
  const keys = Object.keys(props.metae);

  return keys.map((key, index) => (
    <div
      key={`${key}_${index}`}
      className="metae"
      // TODO: fix marginRight: items > 8 ? '0.3rem' : undefined
      style={{ animationDelay: `${(100 * index).toString()}ms` }}
    >
      <h2 className="metae-title">
        {key} ({props.metae?.[key].length})
      </h2>
      <ul>
        {props.metae?.[key].map(({ id, hasSchema, hasRealm, createdAt, updatedAt }: any, idx: any) => (
          <li key={`${key}_${index}_${idx}`} style={{ animationDelay: `${(100 * idx).toString()}ms` }}>
            <h1>
              {id} <FaClock /> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })} <FaClockRotateLeft />{' '}
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })} {hasSchema && <FaListUl />}
            </h1>
          </li>
        ))}
      </ul>
    </div>
  ));
}
