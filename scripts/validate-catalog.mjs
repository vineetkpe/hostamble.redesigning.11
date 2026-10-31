import { readFileSync } from 'node:fs';
import { validateCatalog } from '../src/lib/pricing.mjs';
const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
validateCatalog(catalog);
console.log('Catalog validation passed');
