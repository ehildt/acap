import { useCacheStore } from 'libs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBacon, FaDatabase, FaHome, FaInfo } from 'react-icons/fa';
import { Button, PageMenu, PageMenuItem } from 'ui';

import { Metae } from './components/metae/Metae';

export function App() {
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const { currentTab } = useCacheStore();
  const { t } = useTranslation();

  return (
    // switch default layout if needed
    <div className="layout-default">
      <header className="bar bar--top">
        {t('app.message')}: {currentTab}
      </header>
      <aside style={{ gridArea: 'menu' }}>
        <PageMenu>
          <PageMenuItem
            onMouseEnter={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
            onMouseLeave={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
          >
            <Button iconBefore={<FaHome />} text="Intro" disabled={isDisabled} />
          </PageMenuItem>
          <PageMenuItem
            onMouseEnter={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
            onMouseLeave={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
          >
            <Button iconBefore={<FaDatabase />} text="Realms" disabled={isDisabled} />
          </PageMenuItem>
          <PageMenuItem
            onMouseEnter={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
            onMouseLeave={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
          >
            <Button iconBefore={<FaBacon />} text="Schemas" disabled={isDisabled} />
          </PageMenuItem>
          <PageMenuItem
            onMouseEnter={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
            onMouseLeave={() => {
              setDisabled((isDisabled) => !isDisabled);
            }}
          >
            <Button
              iconBefore={<FaInfo />}
              text="metae"
              disabled={isDisabled}
              onClick={() => {
                console.log('removed');
              }}
            />
          </PageMenuItem>
        </PageMenu>
      </aside>

      <main className="content">
        <Metae />
      </main>
    </div>
  );
}
