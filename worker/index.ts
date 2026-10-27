// Everything is static (dist-export); the script only sends www to the apex,
// which the old nginx/Cloudflare setup did with a 301.
interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === "www.blockout.cc") {
      url.hostname = "blockout.cc";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
