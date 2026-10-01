export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Redirect all traffic on Cloudflare Workers to official Firebase Hosting site
    const target = new URL(`https://niti--ai.web.app${url.pathname}${url.search}`);
    return Response.redirect(target.toString(), 301);
  },
};
