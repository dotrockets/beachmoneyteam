import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'Beach Money Team Blog',
    description: 'Ehrliche Insights aus dem Digital Nomad Leben. Gear Reviews, Coworking Guides, Remote Work Tipps.',
    site: context.site || 'https://beachmoneyteam.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>de-DE</language>',
  });
}
