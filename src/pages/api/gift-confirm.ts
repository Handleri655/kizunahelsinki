import type { APIRoute } from 'astro';
import { confirmGiftPayment, sameOrigin } from '../../lib/gift-order';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return Response.json({ error: 'forbidden' }, { status: 403 });

  let sessionId = '';
  try {
    const payload = (await request.json()) as { sessionId?: unknown };
    sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : '';
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  try {
    const status = await confirmGiftPayment(sessionId);
    if (status === 'unconfigured') return Response.json({ error: 'unconfigured' }, { status: 503 });
    if (status !== 'paid') return Response.json({ error: 'unpaid' }, { status: 402 });
    return Response.json({ paid: true });
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'gift confirm failed');
    return Response.json({ error: 'payment' }, { status: 502 });
  }
};
