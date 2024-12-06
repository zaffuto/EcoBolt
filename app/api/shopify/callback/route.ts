import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const code = searchParams.get('code');
  const hmac = searchParams.get('hmac');
  
  if (!shop || !code || !hmac) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Verify HMAC
  const message = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const calculatedHmac = createHmac('sha256', process.env.SHOPIFY_API_SECRET!)
    .update(message)
    .digest('hex');

  if (calculatedHmac !== hmac) {
    return NextResponse.json(
      { error: 'HMAC verification failed' },
      { status: 401 }
    );
  }

  try {
    // Exchange temporary code for permanent access token
    const accessTokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code
        })
      }
    );

    if (!accessTokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await accessTokenResponse.json();

    // Store the access token securely (you should implement this part)
    // For now, we'll just redirect to the app home
    return NextResponse.redirect('/');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      { error: 'Failed to complete OAuth' },
      { status: 500 }
    );
  }
}
