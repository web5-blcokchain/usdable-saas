export default {
  async fetch(request, env) {
    // const url = new URL(request.url);

    // 如果请求静态文件则直接返回
    const res = await env.ASSETS.fetch(request)
    if (res.status !== 404)
      return res

    // 如果不是静态资源 → 始终返回 index.html (SPA fallback)
    return await env.ASSETS.fetch(new Request('/index.html', request))
  }
}
