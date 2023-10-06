import './PageSwitcher.scss';

import cn from 'classnames';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';

import { PageSwitcherProps } from './PageSwitcher.model';

/**
 * @param onLeftIconClick ProxyOnClick
 * @param onRightIconClick ProxyOnClick
 * @param take number, how many items to be fetched
 * @param skip number, how many items have been skipped so far
 * @param count number, total items amount
 */
export function PageSwitcher(props: PageSwitcherProps) {
  return (
    <div className="page-switcher">
      <FaLeftLong
        onClick={props.onLeftIconClick}
        className={cn({
          'page-switcher--disabled': props.take ? props.skip / props.take + 1 <= 1 : false,
        })}
      />
      <span>{props.count && props.take ? props.skip / props.take + 1 : '⦻'}</span>
      <FaRightLong
        onClick={props.onRightIconClick}
        className={cn({
          'page-switcher--disabled': props.skip + props.take >= props.count,
        })}
      />
    </div>
  );
}
