import { writeFileSync } from 'fs';
import path from 'path';

const demoProducts = [
  {
    title: 'Acme Cup',
    handle: 'acme-cup',
    description: 'A premium ceramic cup perfect for your morning coffee or tea.',
    price: 25.00,
    compareAtPrice: 30.00,
    images: ['https://demo.vercel.store/images/cup.png'],
    variants: [
      {
        title: 'Default Title',
        price: 25.00,
        compareAtPrice: 30.00,
        inventoryQuantity: 100
      }
    ],
    tags: ['Featured', 'Cup'],
    vendor: 'Acme',
    productType: 'Drinkware'
  },
  {
    title: 'Basic Tee',
    handle: 'basic-tee',
    description: 'A comfortable and stylish t-shirt made from premium cotton.',
    price: 35.00,
    compareAtPrice: 40.00,
    images: ['https://demo.vercel.store/images/t-shirt.png'],
    variants: [
      {
        title: 'Small',
        price: 35.00,
        compareAtPrice: 40.00,
        inventoryQuantity: 50
      },
      {
        title: 'Medium',
        price: 35.00,
        compareAtPrice: 40.00,
        inventoryQuantity: 50
      },
      {
        title: 'Large',
        price: 35.00,
        compareAtPrice: 40.00,
        inventoryQuantity: 50
      }
    ],
    options: [
      {
        name: 'Size',
        values: ['Small', 'Medium', 'Large']
      }
    ],
    tags: ['Featured', 'Apparel'],
    vendor: 'Acme',
    productType: 'Shirt'
  }
];

async function createProduct(product: any, accessToken: string, shopDomain: string) {
  const url = `https://${shopDomain}/admin/api/2024-01/products.json`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({ product })
  });

  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`);
  }

  return response.json();
}

async function importProducts() {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  if (!adminAccessToken || !shopDomain) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  console.log('Starting product import...');

  for (const product of demoProducts) {
    try {
      const result = await createProduct(product, adminAccessToken, shopDomain);
      console.log(`Created product: ${result.product.title}`);
    } catch (error) {
      console.error(`Failed to create product ${product.title}:`, error);
    }
  }

  console.log('Product import completed');
}

// Save products data to a JSON file for reference
writeFileSync(
  path.join(__dirname, 'demo-products.json'),
  JSON.stringify(demoProducts, null, 2)
);

if (require.main === module) {
  importProducts().catch(console.error);
}
