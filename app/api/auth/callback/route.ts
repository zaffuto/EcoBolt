import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const hmac = searchParams.get('hmac');
  const timestamp = searchParams.get('timestamp');
  
  if (!shop || !hmac || !timestamp || !SHOPIFY_API_SECRET) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Create the message from the query parameters except hmac
  const message = Object.entries(Object.fromEntries(searchParams))
    .filter(([key]) => key !== 'hmac')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Calculate HMAC
  const calculatedHmac = createHmac('sha256', SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');

  // Verify HMAC
  if (calculatedHmac !== hmac) {
    return NextResponse.json(
      { error: 'HMAC verification failed' },
      { status: 401 }
    );
  }

  // Generate installation URL
  const scopes = [
    'write_products',
    'read_products',
    'write_customers',
    'read_customers',
    'write_orders',
    'read_orders'
  ].join(',');

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  const nonce = Date.now().toString();

  const installUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${process.env.SHOPIFY_API_KEY}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${nonce}`;

  // Store nonce in session/database for later verification
  
  return NextResponse.redirect(installUrl);
}
