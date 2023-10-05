import { LkApp, LkButton } from './i18next.lk.modal';
import { langkify } from './langkify';

export const I18nextAppKey = langkify<LkApp>({
  app: ['welcome', 'message'],
});

export const I18nextButtonKey = langkify<LkButton>({
  button: ['save', 'ok', 'cancel', 'submit', 'add', 'reset'],
});
