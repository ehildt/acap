import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHome, FaInfo } from 'react-icons/fa';
import { Button, FileImporter, PageMenu, PageMenuItem, Skew } from 'ui';

import { Metae } from './components/metae/Metae';
import { useImmerPersistCacheStore } from './store/cache';

export function App() {
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const { tab, setTab } = useImmerPersistCacheStore();
  const { t } = useTranslation();

  return (
    // switch default layout if needed
    <div className="layout-default">
      <header className="bar bar--top">
        {t('app.message')}: {tab}
      </header>
      <aside style={{ gridArea: 'menu' }}>
        <Skew x2="1turn" y2="5deg">
          <PageMenu>
            <PageMenuItem
              onClick={() => {
                setTab('files');
              }}
              onMouseEnter={() => {
                setDisabled((isDisabled) => !isDisabled);
              }}
              onMouseLeave={() => {
                setDisabled((isDisabled) => !isDisabled);
              }}
            >
              <Button iconBefore={<FaHome />} disabled={isDisabled}>
                Files
              </Button>
            </PageMenuItem>
            <PageMenuItem
              onClick={() => {
                setTab('metae');
              }}
              onMouseEnter={() => {
                setDisabled((isDisabled) => !isDisabled);
              }}
              onMouseLeave={() => {
                setDisabled((isDisabled) => !isDisabled);
              }}
            >
              <Button iconBefore={<FaInfo />} disabled={isDisabled}>
                Matea
              </Button>
            </PageMenuItem>
          </PageMenu>
        </Skew>
      </aside>

      <main className="content">
        {tab === 'metae' && <Metae />}
        {tab === 'files' && <FileImporter />}
      </main>
    </div>
  );
}
