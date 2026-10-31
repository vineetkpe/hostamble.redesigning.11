import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hostamble.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
