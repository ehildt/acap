import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { ConfigYml } from './config.yml.modal';

const file = readFileSync(join(__dirname, 'config.yml'), 'utf8');

const CONFIG_YML = load(file) as ConfigYml;

export { CONFIG_YML };
