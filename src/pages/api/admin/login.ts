import type { APIRoute } from 'astro';
import { getAdminPassword, createAuthCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password === getAdminPassword()) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin/dashboard',
          'Set-Cookie': createAuthCookie(),
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin?error=1',
      },
    });
  } catch {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin?error=1',
      },
    });
  }
};
