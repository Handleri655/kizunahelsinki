import { restaurant } from '../data/restaurant';
import { copy } from '../i18n/copy';
import { isLang, localePath, type Lang } from '../i18n/utils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sessionPattern = /^cs_(test|live)_[A-Za-z0-9]+$/;

export type GiftOrder = {
  name: string;
  email: string;
  phone: string;
  amount: number;
  recipient: string;
  delivery: 'pickup' | 'email';
  recipientEmail: string;
  greeting: string;
  lang: Lang;
};

type StripeSession = {
  id: string;
  url?: string | null;
  payment_status?: string;
  payment_intent?: string | { id?: string; metadata?: Record<string, string> | null } | null;
  metadata?: Record<string, string> | null;
};

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function stripeKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return key?.startsWith('sk_') ? key : null;
}

function readText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function readGiftOrder(value: unknown): GiftOrder | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  const name = readText(input.name, 80);
  const email = readText(input.email, 120);
  const phone = readText(input.phone, 40);
  const amount = typeof input.amount === 'number' ? input.amount : Number(input.amount);
  const recipient = readText(input.recipient, 80);
  const greeting = readText(input.greeting, 500);
  const recipientEmail = readText(input.recipientEmail, 120);
  const delivery = input.delivery === 'email' || input.delivery === 'pickup' ? input.delivery : null;
  const lang = typeof input.lang === 'string' && isLang(input.lang) ? input.lang : null;
  const { minAmount, maxAmount } = restaurant.giftCard;

  if (name.length < 2 || !emailPattern.test(email)) return null;
  if (phone.replace(/\D/g, '').length < 6) return null;
  if (!Number.isInteger(amount) || amount < minAmount || amount > maxAmount) return null;
  if (!delivery || !lang) return null;
  if (delivery === 'email' && !emailPattern.test(recipientEmail)) return null;

  return {
    name,
    email,
    phone,
    amount,
    recipient,
    delivery,
    recipientEmail: delivery === 'email' ? recipientEmail : '',
    greeting,
    lang,
  };
}

function orderFromMetadata(metadata: Record<string, string> | null | undefined): GiftOrder | null {
  if (!metadata) return null;
  return readGiftOrder({
    name: metadata.name,
    email: metadata.email,
    phone: metadata.phone,
    amount: Number(metadata.amount),
    recipient: metadata.recipient ?? '',
    delivery: metadata.delivery,
    recipientEmail: metadata.recipient_email ?? '',
    greeting: metadata.greeting ?? '',
    lang: metadata.lang,
  });
}

function orderMessage(order: GiftOrder, paymentId: string): string {
  const t = copy.fi;
  return [
    t.giftMailIntro,
    '',
    `${t.giftBuyerName}: ${order.name}`,
    `${t.giftBuyerEmail}: ${order.email}`,
    `${t.giftBuyerPhone}: ${order.phone}`,
    `${t.giftAmount}: ${order.amount} €`,
    order.recipient ? `${t.giftRecipient}: ${order.recipient}` : '',
    `${t.giftDelivery}: ${order.delivery === 'email' ? t.giftDeliveryEmail : t.giftDeliveryPickup}`,
    order.delivery === 'email' ? `${t.giftRecipientEmail}: ${order.recipientEmail}` : '',
    order.greeting ? `${t.giftGreeting}: ${order.greeting}` : '',
    '',
    `Stripe: ${paymentId}`,
    t.giftMailFooter,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

async function stripeForm(path: string, key: string, body: URLSearchParams): Promise<StripeSession> {
  const encoded = body.toString().replaceAll('%7BCHECKOUT_SESSION_ID%7D', '{CHECKOUT_SESSION_ID}');
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encoded,
  });
  const payload = (await response.json()) as StripeSession & { error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? 'Stripe request failed');
  return payload;
}

async function stripeGet(path: string, key: string): Promise<StripeSession> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const payload = (await response.json()) as StripeSession & { error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? 'Stripe request failed');
  return payload;
}

function addMeta(body: URLSearchParams, prefix: string, fields: Record<string, string>) {
  for (const [field, value] of Object.entries(fields)) {
    if (!value) continue;
    body.set(`${prefix}[${field}]`, value);
  }
}

export async function createGiftCheckout(order: GiftOrder, origin: string): Promise<string> {
  const key = stripeKey();
  if (!key) throw new Error('unconfigured');

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('success_url', `${origin}${localePath(order.lang, 'gift')}/valmis?session_id={CHECKOUT_SESSION_ID}`);
  body.set('cancel_url', `${origin}${localePath(order.lang, 'gift')}?maksu=kesken`);
  body.set('customer_email', order.email);
  body.set('locale', order.lang);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', 'eur');
  body.set('line_items[0][price_data][unit_amount]', String(order.amount * 100));
  body.set('line_items[0][price_data][product_data][name]', 'Ravintola Kizuna lahjakortti');
  body.set('payment_intent_data[description]', `${copy.fi.giftMailSubject} ${order.amount} €`);
  body.set('payment_intent_data[receipt_email]', order.email);

  const fields = {
    name: order.name,
    email: order.email,
    phone: order.phone,
    amount: String(order.amount),
    recipient: order.recipient,
    delivery: order.delivery,
    recipient_email: order.recipientEmail,
    greeting: order.greeting,
    lang: order.lang,
  };
  addMeta(body, 'metadata', fields);
  addMeta(body, 'payment_intent_data[metadata]', fields);

  const session = await stripeForm('/checkout/sessions', key, body);
  if (!session.url) throw new Error('payment');
  return session.url;
}

async function notifyRestaurant(order: GiftOrder, paymentId: string): Promise<boolean> {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(restaurant.email)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `${copy.fi.giftMailSubject} ${order.amount} €`,
      _template: 'box',
      _captcha: 'false',
      _replyto: order.email,
      name: order.name,
      email: order.email,
      message: orderMessage(order, paymentId),
    }),
  });
  const result = (await response.json()) as { success?: string | boolean };
  return response.ok && (result.success === 'true' || result.success === true);
}

export async function confirmGiftPayment(sessionId: string): Promise<'paid' | 'unpaid' | 'unconfigured'> {
  if (!sessionPattern.test(sessionId)) return 'unpaid';
  const key = stripeKey();
  if (!key) return 'unconfigured';

  const session = await stripeGet(`/checkout/sessions/${sessionId}?expand[]=payment_intent`, key);
  if (session.payment_status !== 'paid') return 'unpaid';

  const intent = session.payment_intent;
  const intentId = typeof intent === 'string' ? intent : intent?.id;
  const metadata = {
    ...(session.metadata ?? {}),
    ...(typeof intent === 'object' && intent?.metadata ? intent.metadata : {}),
  };
  if (metadata.restaurant_notified === 'true') return 'paid';

  const order = orderFromMetadata(metadata);
  const sent = order ? await notifyRestaurant(order, intentId ?? session.id) : false;
  if (sent && intentId) {
    const body = new URLSearchParams();
    body.set('metadata[restaurant_notified]', 'true');
    await stripeForm(`/payment_intents/${intentId}`, key, body);
  }
  return 'paid';
}
