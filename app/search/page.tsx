import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import QRCode from 'qrcode';
import { useState } from 'react';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Eco Bolt - Solución para la Ley REP',
  description: 'Descubre cómo Eco Bolt puede ayudarte a cumplir con la Ley REP mediante servicios de logística sostenible y tecnologías avanzadas.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const generateQRCode = async (discount: string, phone: string) => {
    const qrData = `Descuento: ${discount}, Contacto: ${phone}`;
    const url = await QRCode.toDataURL(qrData);
    setQrCodeUrl(url);
  };

  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'resultados' : 'resultado';

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Eco Bolt - Solución para la Ley REP</h1>
        <p className="mb-4 text-lg">
          Eco Bolt es una herramienta clave para empresas obligadas a cumplir con la <strong>Ley REP</strong>. Ofrecemos servicios de logística sostenible y tecnologías avanzadas para recolectar y trasladar productos prioritarios hacia centros de reciclaje o valorización.
        </p>
        <h2 className="text-xl font-bold mb-2">¿Cómo lo logramos?</h2>
        <ul className="list-disc list-inside text-lg">
          <li>
            <strong>Gerente Ai (Bolt):</strong> Configuramos un modelo de Machine Learning que optimiza la gestión de residuos en zonas urbanas, maximizando la eficiencia operativa y minimizando la huella de carbono.
          </li>
          <li>
            <strong>Automatización y trazabilidad:</strong> Integramos APIs públicas chilenas y sistemas de reciclaje avanzados para que las empresas puedan cumplir fácilmente con las metas de la Ley REP, generando reportes automáticos.
          </li>
          <li>
            <strong>Eco Cupon:</strong> Ofrecemos incentivos a los consumidores finales para que entreguen productos prioritarios, como baterías, neumáticos y electrónicos, en puntos de acopio o reciclaje asociados.
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Instala nuestra APP en tu tienda Shopify</h2>
        <p className="mb-4 text-lg">
          Si ya tienes una tienda Shopify, sigue las instrucciones para instalar nuestra APP y empezar a usar Eco Bolt. Si no tienes una tienda, crea una nueva con nuestro descuento exclusivo.
        </p>
        <div className="mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => generateQRCode('20% Descuento', '+56912345678')}
          >
            Generar QR para descuento
          </button>
          {qrCodeUrl && (
            <div className="mt-4">
              <img src={qrCodeUrl} alt="Código QR de descuento" className="mb-4" />
              <p className="text-lg">Envíalo a tu celular para compartirlo por WhatsApp.</p>
            </div>
          )}
        </div>
      </div>
      {searchValue ? (
        <p className="mb-4 text-lg">
          {products.length === 0
            ? 'No hay productos que coincidan con '
            : `Mostrando ${products.length} ${resultsText} para `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
