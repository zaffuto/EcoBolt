import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoProducts = [
  {
    title: 'SmartBot Premium',
    handle: 'smartbot-premium',
    description: 'Acceso premium a nuestra plataforma de chat inteligente con funciones avanzadas.',
    price: 29990.00,
    compareAtPrice: 39990.00,
    images: ['https://smarterbot.cl/images/premium-plan.png'],
    variants: [
      {
        title: 'Plan Mensual',
        price: 29990.00,
        compareAtPrice: 39990.00,
        inventoryQuantity: 999
      }
    ],
    tags: ['Featured', 'Premium', 'AI'],
    vendor: 'SmarterBot',
    productType: 'Subscription',
    status: 'active'
  },
  {
    title: 'SmartBot Enterprise',
    handle: 'smartbot-enterprise',
    description: 'Solución empresarial personalizada con soporte dedicado y características exclusivas.',
    price: 99990.00,
    compareAtPrice: 149990.00,
    images: ['https://smarterbot.cl/images/enterprise-plan.png'],
    variants: [
      {
        title: 'Plan Anual',
        price: 99990.00,
        compareAtPrice: 149990.00,
        inventoryQuantity: 100
      }
    ],
    tags: ['Featured', 'Enterprise', 'AI'],
    vendor: 'SmarterBot',
    productType: 'Enterprise',
    status: 'active'
  }
];

async function createProduct(product) {
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!shop || !accessToken) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN');
  }

  console.log(`Creating product: ${product.title}`);
  console.log(`Shop domain: ${shop}`);
  const url = `https://${shop}/admin/api/2024-01/products.json`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({ product })
    });

    const responseText = await response.text();
    console.log(`Response for ${product.title}:`, responseText);

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status} ${response.statusText}\n${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error creating ${product.title}:`, error);
    throw error;
  }
}

async function importProducts() {
  console.log('Starting product import...');
  console.log('Environment variables loaded:', {
    shop: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    hasToken: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
  });
  
  for (const product of demoProducts) {
    try {
      const result = await createProduct(product);
      console.log(`Successfully created product: ${result.product.title}`);
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

if (import.meta.url === `file://${__filename}`) {
  importProducts().catch(console.error);
}
