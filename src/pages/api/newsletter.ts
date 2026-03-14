import type { APIRoute } from 'astro';
import { store } from '../../lib/store';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ ok: false, error: 'Bitte gib eine gueltige E-Mail Adresse ein.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const added = store.addNewsletter({
      email,
      timestamp: new Date().toISOString(),
      source: request.headers.get('referer') || '/',
    });

    if (!added) {
      return new Response(JSON.stringify({ ok: true, message: 'Bereits registriert.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[BMT] Newsletter signup:', email);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Etwas ist schiefgelaufen.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
