import './MetaeMenu.scss';

import { SelectBox } from 'components';

import { PageSwitcher } from '../inputs/page-switcher/PageSwitcher';

type MetaeMenuProps = {
  source: string;
  skip: number;
  take: number;
  count: number;
  onSourceChange: (value: string) => void;
  onTakeChange: (value: string) => void;
  onLeftIconClick: () => void;
  onRightIconClick: () => void;
};

export function MetaeMenu(props: MetaeMenuProps) {
  const { skip, take, source, count } = props;
  return (
    <nav className="metae-menu">
      <h1>Metae</h1>
      <ul className="metae-menu-items">
        <li id="metae-source">
          <SelectBox
            defaultIndex={0}
            onClick={props.onSourceChange}
            items={[
              { name: 'Realms', value: 'realms' },
              { name: 'Schemas', value: 'schemas' },
            ]}
          />
        </li>
        <li>
          <SelectBox
            defaultIndex={0}
            onClick={props.onTakeChange}
            customInput
            items={[
              { name: 'Take 3', value: 3 },
              { name: 'Take 5', value: 5 },
              { name: 'Take 8', value: 8 },
            ]}
          />
        </li>
        <li>
          <PageSwitcher
            onLeftIconClick={props.onLeftIconClick}
            onRightIconClick={props.onRightIconClick}
            skip={skip}
            take={take}
            count={count}
          />
        </li>
      </ul>
    </nav>
  );
}
