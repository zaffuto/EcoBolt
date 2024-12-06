import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code, shop, state } = await request.json();

  if (!code || !shop || !state) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Verify state/nonce from previous step
  
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

    // Store the access token securely
    // You should encrypt this token and store it in a secure database
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange code for token' },
      { status: 500 }
    );
  }
}
