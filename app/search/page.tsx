import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import SearchClient from './search-client';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Eco Bolt - Solución para la Ley REP',
  description: 'Descubre cómo Eco Bolt puede ayudarte a cumplir con la Ley REP mediante servicios de logística sostenible y tecnologías avanzadas.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { sort, q: searchValue } = searchParams || {};
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || { sortKey: defaultSort, reverse: false };
  const products = await getProducts({ sortKey, reverse, query: searchValue as string });

  return (
    <div>
      <SearchClient products={products} searchValue={searchValue as string} />
    </div>
  );
}
