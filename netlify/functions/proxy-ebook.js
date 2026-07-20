export default async (req) => {
  const url = new URL(req.url).searchParams.get("url");

  if (!url || !url.startsWith("https://github.com/")) {
    return new Response("Invalid or missing url", { status: 400 });
  }

  try {
    const upstream = await fetch(url, { redirect: "follow" });

    if (!upstream.ok) {
      return new Response("Failed to fetch file", { status: upstream.status });
    }

    const body = await upstream.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return new Response("Proxy error", { status: 500 });
  }
};

export const config = { path: "/api/proxy-ebook" };