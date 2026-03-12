import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Badge, Card } from '@/components/ui';
import { formatCurrency, getDiscountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <Card hover className="overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.discountPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{getDiscountPercent(product.price, product.discountPrice)}%
            </span>
          )}
          {product.isOrganic && (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              🌿 Organic
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-green-700 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <Badge variant="gray">{product.unit}</Badge>
        </div>

        <p className="text-xs text-gray-500 line-clamp-1">📍 {product.location}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.totalReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-green-700 font-bold text-base">
            {formatCurrency(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className={`mt-1 w-full rounded-lg py-2 text-sm font-medium transition-colors ${
            inCart
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : inCart ? '✓ In Cart' : 'Add to Cart'}
        </button>
      </div>
    </Card>
  );
}
