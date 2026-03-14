import type { APIRoute } from 'astro';
import { store } from '../../lib/store';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    store.addClick({
      id: data.id || '',
      product: data.product || '',
      timestamp: data.timestamp || new Date().toISOString(),
      referrer: data.referrer || '',
      path: data.path || '',
    });

    console.log('[BMT] Affiliate click:', data.product, data.id);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
