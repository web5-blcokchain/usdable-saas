import { serveStatic } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env) {
    try {
      return await serveStatic(request, env.ASSETS)
    }
    catch {
      return await env.ASSETS.fetch(new Request('/index.html', request))
    }
  }
}
