// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button, Input, Card } from '@/components/ui';
// import { useAuth } from '@/context/AuthContext';
// import { formatCurrency } from '@/lib/utils';
// import { VendorProduct } from '@/hooks/useVendorProduct';
// import { useVendorProducts } from '@/hooks/useVendorProduct';
// import { QueryClient, useQueryClient } from '@tanstack/react-query';
// import api from '@/lib/apiClient';

// interface Category {
//   id: string;
//   name: string;
//   icon: string;
// }

// interface ProductFormProps {
//   mode: 'create' | 'edit';
//   initialData?: VendorProduct;
// }

// interface FormState {
//   name: string;
//   description: string;
//   price: string;
//   discountPrice: string;
//   stock: string;
//   unit: string;
//   categoryId: string;
//   isOrganic: boolean;
//   isFeatured: boolean;
// }

// const UNITS = [
//   'kg',
//   'g',
//   'piece',
//   'bunch',
//   'litre',
//   'ml',
//   'dozen',
//   'pack',
//   'box',
//   'bag',
// ];

// export function ProductForm({ mode, initialData }: ProductFormProps) {
//   const router = useRouter();
//   // const { token } = useAuth();
//   const { editProduct } = useVendorProducts();
//   const [form, setForm] = useState<FormState>({
//     name: initialData?.name ?? '',
//     description: initialData?.description ?? '',
//     price: initialData?.price ? String(initialData.price) : '',
//     discountPrice: initialData?.discountPrice
//       ? String(initialData.discountPrice)
//       : '',
//     stock: initialData?.stock ? String(initialData.stock) : '',
//     unit: initialData?.unit ?? 'kg',
//     categoryId: initialData?.categoryId ?? '',
//     isOrganic: initialData?.isOrganic ?? false,
//     isFeatured: initialData?.isFeatured ?? false,
//   });

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [errors, setErrors] = useState<Partial<FormState>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch('/api/categories')
//       .then((r) => r.json())
//       .then((data) =>
//         setCategories(Array.isArray(data) ? data : (data.data ?? [])),
//       )
//       .catch(() => {});
//   }, []);

//   const set =
//     (key: keyof FormState) =>
//     (
//       e: React.ChangeEvent<
//         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//       >,
//     ) => {
//       const value =
//         e.target.type === 'checkbox'
//           ? (e.target as HTMLInputElement).checked
//           : e.target.value;
//       setForm((prev) => ({ ...prev, [key]: value }));
//       setErrors((prev) => ({ ...prev, [key]: undefined }));
//     };

//   const validate = (): boolean => {
//     const errs: Partial<FormState> = {};
//     if (!form.name.trim()) errs.name = 'Product name is required';
//     if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
//       errs.price = 'Enter a valid price';
//     if (
//       form.discountPrice &&
//       (isNaN(Number(form.discountPrice)) ||
//         Number(form.discountPrice) >= Number(form.price))
//     )
//       errs.discountPrice = 'Discount price must be less than regular price';
//     if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
//       errs.stock = 'Enter a valid stock quantity';
//     if (!form.categoryId) errs.categoryId = 'Select a category';
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const queryClient = useQueryClient();
//   const handleSubmit = async () => {
//     if (!validate()) return;
//     setSubmitting(true);
//     setSubmitError(null);

//     const body = {
//       name: form.name.trim(),
//       description: form.description.trim(),
//       price: Number(form.price),
//       discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
//       stock: Number(form.stock),
//       unit: form.unit,
//       categoryId: form.categoryId,
//       isOrganic: form.isOrganic,
//       isFeatured: form.isFeatured,
//     };

//     try {
//       if (mode === 'create') {
//         await api.post('/products', body);
//       } else {
//         await api.put(`/products/${initialData!.id}`, body);
//       }
//       await queryClient.invalidateQueries({ queryKey: ['vendor-products'] });

//       if (mode === 'edit') {
//         await queryClient.invalidateQueries({
//           queryKey: ['vendor-product', initialData!.id],
//         });
//       }

//       router.push('/vendor/products');
//       router.refresh();
//     } catch (e: any) {
//       setSubmitError(
//         e.response?.data?.error ?? e.message ?? 'Something went wrong',
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const priceNum = Number(form.price);
//   const discountNum = Number(form.discountPrice);
//   const savings =
//     form.discountPrice && discountNum < priceNum
//       ? ((1 - discountNum / priceNum) * 100).toFixed(0)
//       : null;

//   return (
//     <div className="max-w-2xl space-y-6">
//       {/* Basic Info */}
//       <Card className="space-y-4">
//         <h2 className="font-semibold text-gray-900">Basic Information</h2>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Product Name *
//           </label>
//           <Input
//             placeholder="e.g. Fresh Organic Tomatoes"
//             value={form.name}
//             onChange={set('name')}
//           />
//           {errors.name && (
//             <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
//             rows={3}
//             placeholder="Describe your product, growing methods, freshness, etc."
//             value={form.description}
//             onChange={set('description')}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Category *
//           </label>
//           <select
//             className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
//             value={form.categoryId}
//             onChange={set('categoryId')}
//           >
//             <option value="">Select a category…</option>
//             {categories.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.icon} {c.name}
//               </option>
//             ))}
//           </select>
//           {errors.categoryId && (
//             <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
//           )}
//         </div>
//       </Card>

//       {/* Pricing */}
//       <Card className="space-y-4">
//         <h2 className="font-semibold text-gray-900">Pricing</h2>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Regular Price (D) *
//             </label>
//             <Input
//               type="number"
//               min="0"
//               step="0.01"
//               placeholder="0.00"
//               value={form.price}
//               onChange={set('price')}
//             />
//             {errors.price && (
//               <p className="mt-1 text-xs text-red-500">{errors.price}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Discount Price (D)
//               {savings && (
//                 <span className="ml-2 text-xs text-emerald-600 font-semibold">
//                   {savings}% off
//                 </span>
//               )}
//             </label>
//             <Input
//               type="number"
//               min="0"
//               step="0.01"
//               placeholder="Optional"
//               value={form.discountPrice}
//               onChange={set('discountPrice')}
//             />
//             {errors.discountPrice && (
//               <p className="mt-1 text-xs text-red-500">
//                 {errors.discountPrice}
//               </p>
//             )}
//           </div>
//         </div>

//         {form.price && (
//           <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
//             Customer pays:{' '}
//             <span className="font-semibold text-gray-900">
//               {formatCurrency(
//                 form.discountPrice && discountNum < priceNum
//                   ? discountNum
//                   : priceNum,
//               )}
//             </span>
//             {savings && (
//               <span className="ml-2 text-gray-400 line-through">
//                 {formatCurrency(priceNum)}
//               </span>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Inventory */}
//       <Card className="space-y-4">
//         <h2 className="font-semibold text-gray-900">Inventory</h2>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Stock Quantity *
//             </label>
//             <Input
//               type="number"
//               min="0"
//               placeholder="0"
//               value={form.stock}
//               onChange={set('stock')}
//             />
//             {errors.stock && (
//               <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Unit
//             </label>
//             <select
//               className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
//               value={form.unit}
//               onChange={set('unit')}
//             >
//               {UNITS.map((u) => (
//                 <option key={u} value={u}>
//                   {u}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {form.stock && (
//           <div
//             className={`rounded-lg px-4 py-2 text-sm font-medium ${
//               Number(form.stock) === 0
//                 ? 'bg-red-50 text-red-700'
//                 : Number(form.stock) <= 50
//                   ? 'bg-amber-50 text-amber-700'
//                   : 'bg-emerald-50 text-emerald-700'
//             }`}
//           >
//             {Number(form.stock) === 0
//               ? '⚠️ Out of stock'
//               : Number(form.stock) <= 50
//                 ? '⚡ Low stock'
//                 : '✓ In stock'}{' '}
//             — {form.stock} {form.unit} available
//           </div>
//         )}
//       </Card>

//       {/* Options */}
//       <Card className="space-y-3">
//         <h2 className="font-semibold text-gray-900">Options</h2>

//         {[
//           {
//             key: 'isOrganic' as const,
//             label: 'Organic Product',
//             desc: 'Show an Organic badge on this listing',
//           },
//           {
//             key: 'isFeatured' as const,
//             label: 'Featured Product',
//             desc: 'Highlight this product on the homepage',
//           },
//         ].map(({ key, label, desc }) => (
//           <label
//             key={key}
//             className="flex items-start gap-3 cursor-pointer group"
//           >
//             <div className="relative mt-0.5">
//               <input
//                 type="checkbox"
//                 className="sr-only"
//                 checked={form[key] as boolean}
//                 onChange={(e) =>
//                   setForm((prev) => ({ ...prev, [key]: e.target.checked }))
//                 }
//               />
//               <div
//                 className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
//                   form[key]
//                     ? 'bg-emerald-500 border-emerald-500'
//                     : 'border-gray-300 group-hover:border-emerald-400'
//                 }`}
//               >
//                 {form[key] && (
//                   <svg
//                     className="w-3 h-3 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={3}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 )}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{label}</p>
//               <p className="text-xs text-gray-500">{desc}</p>
//             </div>
//           </label>
//         ))}
//       </Card>

//       {/* Submit */}
//       {submitError && (
//         <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//           {submitError}
//         </div>
//       )}

//       <div className="flex gap-3">
//         <Button
//           variant="outline"
//           onClick={() => router.back()}
//           disabled={submitting}
//         >
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} disabled={submitting}>
//           {submitting
//             ? mode === 'create'
//               ? 'Creating…'
//               : 'Saving…'
//             : mode === 'create'
//               ? 'Create Product'
//               : 'Save Changes'}
//         </Button>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { VendorProduct, useVendorProducts } from '@/hooks/useVendorProduct';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: VendorProduct;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  unit: string;
  location: string; // ← added
  categoryId: string;
  isOrganic: boolean;
  isFeatured: boolean;
}

const UNITS = ['KG', 'BAG', 'CRATE', 'TON', 'PIECE']; // match Unit enum in schema

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ? String(initialData.price) : '',
    discountPrice: initialData?.discountPrice
      ? String(initialData.discountPrice)
      : '',
    stock: initialData?.stock ? String(initialData.stock) : '',
    unit: initialData?.unit ?? 'KG',
    location: initialData?.location ?? '', // ← added
    categoryId: initialData?.categoryId ?? '',
    isOrganic: initialData?.isOrganic ?? false,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : (data.data ?? [])),
      )
      .catch(() => {});
  }, []);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Enter a valid price';
    if (
      form.discountPrice &&
      (isNaN(Number(form.discountPrice)) ||
        Number(form.discountPrice) >= Number(form.price))
    )
      errs.discountPrice = 'Discount price must be less than regular price';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Enter a valid stock quantity';
    if (!form.categoryId) errs.categoryId = 'Select a category';
    if (!form.location.trim()) errs.location = 'Product location is required'; // ← validate
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      unit: form.unit,
      location: form.location.trim(), // ← included in body
      categoryId: form.categoryId,
      isOrganic: form.isOrganic,
      isFeatured: form.isFeatured,
    };

    try {
      if (mode === 'create') {
        await api.post('/products', body);
      } else {
        await api.put(`/products/${initialData!.id}`, body);
      }

      await queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      if (mode === 'edit') {
        await queryClient.invalidateQueries({
          queryKey: ['vendor-product', initialData!.id],
        });
      }

      router.push('/vendor/products');
      router.refresh();
    } catch (e: any) {
      setSubmitError(
        e.response?.data?.error ?? e.message ?? 'Something went wrong',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const priceNum = Number(form.price);
  const discountNum = Number(form.discountPrice);
  const savings =
    form.discountPrice && discountNum < priceNum
      ? ((1 - discountNum / priceNum) * 100).toFixed(0)
      : null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Basic Info */}
      <Card className="space-y-4">
        <h2 className="font-semibold text-gray-900">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <Input
            placeholder="e.g. Fresh Organic Tomatoes"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Describe your product, growing methods, freshness, etc."
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            value={form.categoryId}
            onChange={set('categoryId')}
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
          )}
        </div>

        {/* Location — required by schema */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Location *
          </label>
          <Input
            placeholder="e.g. Brikama Farm, The Gambia"
            value={form.location}
            onChange={set('location')}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">{errors.location}</p>
          )}
        </div>
      </Card>

      {/* Pricing */}
      <Card className="space-y-4">
        <h2 className="font-semibold text-gray-900">Pricing</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Price (D) *
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={set('price')}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Price (D)
              {savings && (
                <span className="ml-2 text-xs text-emerald-600 font-semibold">
                  {savings}% off
                </span>
              )}
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              value={form.discountPrice}
              onChange={set('discountPrice')}
            />
            {errors.discountPrice && (
              <p className="mt-1 text-xs text-red-500">
                {errors.discountPrice}
              </p>
            )}
          </div>
        </div>

        {form.price && (
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Customer pays:{' '}
            <span className="font-semibold text-gray-900">
              {formatCurrency(
                form.discountPrice && discountNum < priceNum
                  ? discountNum
                  : priceNum,
              )}
            </span>
            {savings && (
              <span className="ml-2 text-gray-400 line-through">
                {formatCurrency(priceNum)}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Inventory */}
      <Card className="space-y-4">
        <h2 className="font-semibold text-gray-900">Inventory</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={set('stock')}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              value={form.unit}
              onChange={set('unit')}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u.charAt(0) + u.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.stock && (
          <div
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              Number(form.stock) === 0
                ? 'bg-red-50 text-red-700'
                : Number(form.stock) <= 50
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {Number(form.stock) === 0
              ? '⚠️ Out of stock'
              : Number(form.stock) <= 50
                ? '⚡ Low stock'
                : '✓ In stock'}{' '}
            — {form.stock} {form.unit.toLowerCase()} available
          </div>
        )}
      </Card>

      {/* Options */}
      <Card className="space-y-3">
        <h2 className="font-semibold text-gray-900">Options</h2>

        {[
          {
            key: 'isOrganic' as const,
            label: 'Organic Product',
            desc: 'Show an Organic badge on this listing',
          },
          {
            key: 'isFeatured' as const,
            label: 'Featured Product',
            desc: 'Highlight this product on the homepage',
          },
        ].map(({ key, label, desc }) => (
          <label
            key={key}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                className="sr-only"
                checked={form[key] as boolean}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.checked }))
                }
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                  form[key]
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300 group-hover:border-emerald-400'
                }`}
              >
                {form[key] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </label>
        ))}
      </Card>

      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create Product'
              : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
