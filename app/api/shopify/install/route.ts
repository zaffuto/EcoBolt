import { NextResponse } from 'next/server';

const scopes = [
  'write_products',
  'read_products',
  'write_customers',
  'read_customers',
  'write_orders',
  'read_orders',
  'write_inventory',
  'read_inventory'
].join(',');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  const installUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${process.env.SHOPIFY_API_KEY}&` +
    `scope=${scopes}&` +
    `redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback&` +
    `state=${Date.now()}`; // You might want to use a more secure state value

  return NextResponse.redirect(installUrl);
}
