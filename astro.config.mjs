import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://www.hostamble.com',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
