import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const effectivePrice = product.discountPrice ?? product.price;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium text-gray-900 hover:text-green-700 line-clamp-2 text-sm"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-500 mt-1">{product.unit}</p>
        <p className="text-green-700 font-semibold text-sm mt-1">
          {formatCurrency(effectivePrice)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm"
          >
            −
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-40"
          >
            +
          </button>
        </div>
        <p className="font-bold text-gray-900 text-sm">
          {formatCurrency(effectivePrice * quantity)}
        </p>
        <button
          onClick={() => removeItem(product.id)}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
