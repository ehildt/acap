import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

import { Config } from './config.modal';

const file = readFileSync(join(__dirname, 'config.yml'), 'utf8');

export const CONFIG_YML = load(file, { filename: 'config.yml' }) as Config;
