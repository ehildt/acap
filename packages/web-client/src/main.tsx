import '@/scss/style.scss';
import '@/lang/i18next';

// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const container = document.getElementById('app');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(container!)?.render(<App />);
