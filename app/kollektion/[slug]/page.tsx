import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import { ProductDetail } from './ProductDetail';

export function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productsData.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  const cross = productsData
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return <ProductDetail product={product as any} cross={cross as any} />;
}
