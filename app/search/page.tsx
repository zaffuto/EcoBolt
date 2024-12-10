import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Solución Eco Bolt aplicada a la Ley REP</h2>
        <p>Tu proyecto Eco Bolt puede convertirse en una herramienta clave para empresas obligadas a cumplir con la Ley REP, ofreciendo servicios de logística sostenible para recolectar y trasladar productos prioritarios hacia centros de reciclaje o valorización.</p>
        <ul className="list-disc list-inside">
          <li><strong>Gerente Ai (Bolt)</strong>: Configurar el modelo LLM para tomar decisiones optimizadas en la gestión de residuos en zonas urbanas, maximizando la eficiencia y minimizando la huella de carbono.</li>
          <li><strong>Automatización y trazabilidad</strong>: Usar la granja Ai para integrar APIs públicas chilenas y sistemas de reciclaje que permitan a las empresas cumplir con sus metas REP mediante reportes automatizados.</li>
          <li><strong>Eco Cupon</strong>: Usarlo como incentivo para los consumidores finales, promoviendo que entreguen productos prioritarios (baterías, neumáticos, electrónicos) a puntos de acopio o reciclaje asociados.</li>
        </ul>
      </div>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
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
