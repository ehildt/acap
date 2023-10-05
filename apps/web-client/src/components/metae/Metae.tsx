import './Metae.scss';

import { ReactNode, useEffect, useState } from 'react';

import { useACAPApi } from '@/api/acap/acap-api.hook';
import { METAE_SOURCE } from '@/api/acap/acap-api.model';

import { Scrollbar } from '../scrollbars';
import { MetaeItem } from './MetaeItem';
import { MetaeMenu } from './MetaeMenu';

type MetaeProps = {
  children?: ReactNode;
};

export function Metae(props: MetaeProps) {
  const [take, setTake] = useState<number>(3);
  const [count, setCount] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  const [source, setSource] = useState<METAE_SOURCE>('realms');
  const [metae, setMetae] = useState<Record<string, any>>({});
  const acapAPI = useACAPApi({ baseUrl: 'http://localhost:3001' });

  useEffect(() => {
    // TODO: fetch-retention
    acapAPI
      .getMeta(source, take, skip)
      .then((data) => data?.json())
      .then(({ data, count }) => {
        setMetae(data);
        setCount(count);
      });
  }, [take, skip, source]);

  // TODO: MetaeItem

  return (
    <>
      <MetaeMenu
        skip={skip}
        take={take}
        count={count}
        source={source}
        onLeftIconClick={() => setSkip((skip) => (skip >= take ? skip - take : skip))}
        onRightIconClick={() => setSkip((skip) => skip + take)}
        onSourceChange={(value) => {
          setSkip(() => 0);
          setSource(() => value as METAE_SOURCE);
        }}
        onTakeChange={(value) => {
          setSkip(() => 0);
          setTake(() => parseInt(value, 10));
        }}
      />

      <Scrollbar overflow="y" behavior="smooth" style={{ height: '40dvw', width: '100%', marginTop: '0.3rem' }}>
        <MetaeItem metae={metae} />
      </Scrollbar>
    </>
  );
}
