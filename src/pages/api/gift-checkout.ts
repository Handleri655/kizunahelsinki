import type { APIRoute } from 'astro';
import { createGiftCheckout, readGiftOrder, sameOrigin } from '../../lib/gift-order';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return Response.json({ error: 'forbidden' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const order = readGiftOrder(payload);
  if (!order) return Response.json({ error: 'invalid' }, { status: 400 });

  try {
    const url = await createGiftCheckout(order, new URL(request.url).origin);
    return Response.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === 'unconfigured') {
      return Response.json({ error: 'unconfigured' }, { status: 503 });
    }
    console.error(error instanceof Error ? error.message : 'gift checkout failed');
    return Response.json({ error: 'payment' }, { status: 502 });
  }
};
