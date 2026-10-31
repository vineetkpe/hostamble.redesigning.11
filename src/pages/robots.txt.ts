const launched = import.meta.env.PUBLIC_SITE_STAGE === 'production';
export function GET() {
  const body = launched
    ? 'User-agent: *\nAllow: /\nSitemap: https://www.hostamble.com/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
