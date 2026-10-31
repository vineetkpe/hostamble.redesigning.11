const launched = import.meta.env.PUBLIC_SITE_STAGE === 'production';
const publicPaths = ['/','/shared-hosting','/wordpress-hosting','/domains','/business-email','/vps','/about','/support','/guides','/legal'];
export function GET() {
  const urls = launched ? publicPaths.map(path=>'<url><loc>https://www.hostamble.com'+path+'</loc></url>').join('') : '';
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
