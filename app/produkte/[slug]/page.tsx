import { notFound } from 'next/navigation';
import { getProduct, products } from '@/lib/data';
import { ProductDetail } from './ProductDetail';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Produkt nicht gefunden · Green-Gard' };
  return {
    title: `${product.name} · Green-Gard`,
    description: product.shortDesc,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const cross = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return <ProductDetail product={product} cross={cross} />;
}
