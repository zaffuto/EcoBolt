export async function shopifyAdminRequest(endpoint: string, options: RequestInit = {}) {
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  const response = await fetch(
    `https://${shop}/admin/api/2024-01/${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken!,
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify Admin API error: ${error}`);
  }

  return response.json();
}

export async function createProduct(product: any) {
  return shopifyAdminRequest('products.json', {
    method: 'POST',
    body: JSON.stringify({ product }),
  });
}

export async function updateProduct(productId: string, product: any) {
  return shopifyAdminRequest(`products/${productId}.json`, {
    method: 'PUT',
    body: JSON.stringify({ product }),
  });
}

export async function deleteProduct(productId: string) {
  return shopifyAdminRequest(`products/${productId}.json`, {
    method: 'DELETE',
  });
}
