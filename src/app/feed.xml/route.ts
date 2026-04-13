import { posts } from "@/app/blog/_posts/registry";

export async function GET() {
    const baseUrl = "https://cranksmith.com";

    const sortedPosts = Object.entries(posts)
        .map(([slug, { metadata }]) => ({ slug, ...metadata }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestDate = sortedPosts[0]?.date || new Date().toISOString();

    const items = sortedPosts.map((post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.image ? `<enclosure url="${baseUrl}${post.image}" type="image/webp" />` : ""}
    </item>`).join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CrankSmith Blog — Gravel Bike Builds &amp; Tech</title>
    <link>${baseUrl}/blog</link>
    <description>Expert guides on gravel bike builds, tire compatibility, drivetrain gearing, and component standards. Real data, no fluff.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/icon-512.png</url>
      <title>CrankSmith</title>
      <link>${baseUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
