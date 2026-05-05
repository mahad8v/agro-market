// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '@/context/CartContext';
// import { useCreateOrder } from '@/features/orders/hooks';
// import { formatCurrency } from '@/lib/utils';
// import { ShippingAddress } from '@/types';
// import Link from 'next/link';

// // ── Gambia Regions ─────────────────────────────────────────────────────────
// const GAMBIA_REGIONS = [
//   'Banjul',
//   'Kanifing',
//   'Brikama',
//   'Mansakonko',
//   'Kerewan',
//   'Kuntaur',
//   'Janjanbureh',
//   'Basse',
// ];

// // ── Payment Methods ────────────────────────────────────────────────────────
// const PAYMENT_METHODS = [
//   {
//     id: 'wave',
//     name: 'Wave',
//     tagline: 'Pay with Wave Mobile Money',
//     selectedBorder: 'border-cyan-400',
//     selectedBg: 'bg-cyan-50',
//     textColor: 'text-cyan-600',
//     checkBg: 'bg-cyan-400',
//     btnBg: 'bg-cyan-500 hover:bg-cyan-600',
//     noteBorder: 'border-cyan-300',
//     noteBg: 'bg-cyan-50',
//     note: '💡 Open your Wave app and approve the payment request',
//     logo: (
//       <div className="w-9 h-9 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
//         <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5">
//           <path
//             d="M5 20 Q12 10 20 20 Q28 30 35 20"
//             stroke="white"
//             strokeWidth="3.5"
//             strokeLinecap="round"
//             fill="none"
//           />
//         </svg>
//       </div>
//     ),
//   },
//   {
//     id: 'afrimoney',
//     name: 'Africell Money',
//     tagline: 'Pay with Africell Mobile Money',
//     selectedBorder: 'border-red-400',
//     selectedBg: 'bg-red-50',
//     textColor: 'text-red-600',
//     checkBg: 'bg-red-500',
//     btnBg: 'bg-red-500 hover:bg-red-600',
//     noteBorder: 'border-red-200',
//     noteBg: 'bg-red-50',
//     note: '💡 You will receive an SMS to confirm payment on your Africell line',
//     logo: (
//       <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shrink-0">
//         <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5">
//           <path
//             d="M12 13 L20 27 L28 13"
//             stroke="white"
//             strokeWidth="3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             fill="none"
//           />
//           <circle cx="20" cy="20" r="3" fill="white" />
//         </svg>
//       </div>
//     ),
//   },
//   {
//     id: 'cash',
//     name: 'Cash on Delivery',
//     tagline: 'Pay when your order arrives',
//     selectedBorder: 'border-green-400',
//     selectedBg: 'bg-green-50',
//     textColor: 'text-green-700',
//     checkBg: 'bg-green-500',
//     btnBg: 'bg-green-600 hover:bg-green-700',
//     noteBorder: 'border-green-200',
//     noteBg: 'bg-green-50',
//     note: '',
//     logo: (
//       <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-lg shrink-0">
//         💵
//       </div>
//     ),
//   },
// ];

// const DELIVERY_OPTIONS = [
//   {
//     id: 'standard',
//     label: 'Standard Delivery',
//     desc: '2–4 business days',
//     price: 'Free',
//     amount: 0,
//   },
//   {
//     id: 'express',
//     label: 'Express Delivery',
//     desc: 'Same / next day',
//     price: 'D150',
//     amount: 150,
//   },
// ];

// // ── Tiny helpers ───────────────────────────────────────────────────────────
// const inputCls = (err?: string) =>
//   `w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none
//    transition focus:bg-white focus:ring-2 focus:ring-green-300 focus:border-green-400
//    ${err ? 'border-red-400' : 'border-gray-200'}`;

// const FormField = ({
//   label,
//   required,
//   error,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   error?: string;
//   children: React.ReactNode;
// }) => (
//   <div>
//     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//       {label}
//       {required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {children}
//     {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//   </div>
// );

// // ── Main ───────────────────────────────────────────────────────────────────
// export default function CheckoutPage() {
//   const { vendorGroups, totalAmount, clearCart } = useCart();
//   const { mutateAsync: createOrder, isPending } = useCreateOrder();
//   const router = useRouter();

//   const [form, setForm] = useState<ShippingAddress>({
//     fullName: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     postalCode: '',
//   });
//   const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
//   const [paymentId, setPaymentId] = useState('wave');
//   const [mobile, setMobile] = useState('');
//   const [mobileErr, setMobileErr] = useState('');
//   const [delivery, setDelivery] = useState('standard');
//   const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

//   if (vendorGroups.length === 0) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
//         <span className="text-5xl">🛒</span>
//         <p className="text-gray-400 text-sm">Your cart is empty.</p>
//         <Link
//           href="/products"
//           className="text-green-600 font-semibold text-sm hover:underline"
//         >
//           Browse Products →
//         </Link>
//       </div>
//     );
//   }

//   const pm = PAYMENT_METHODS.find((p) => p.id === paymentId)!;
//   const deliveryAmt =
//     DELIVERY_OPTIONS.find((d) => d.id === delivery)?.amount ?? 0;
//   const grandTotal = totalAmount + deliveryAmt;

//   const setField = (k: keyof ShippingAddress, v: string) => {
//     setForm((p) => ({ ...p, [k]: v }));
//     setErrors((p) => ({ ...p, [k]: undefined }));
//   };

//   const validateShipping = () => {
//     const e: Partial<ShippingAddress> = {};
//     if (!form.fullName) e.fullName = 'Required';
//     if (!form.phone) e.phone = 'Required';
//     if (!form.address) e.address = 'Required';
//     if (!form.city) e.city = 'Required';
//     if (!form.state) e.state = 'Required';
//     setErrors(e);
//     return !Object.keys(e).length;
//   };

//   const validatePayment = () => {
//     if (paymentId === 'cash') return true;
//     if (!mobile) {
//       setMobileErr('Mobile number is required');
//       return false;
//     }
//     if (!/^(\+220|220)?[2-9]\d{6}$/.test(mobile.replace(/\s/g, ''))) {
//       setMobileErr('Enter a valid Gambian number');
//       return false;
//     }
//     setMobileErr('');
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validatePayment()) return;
//     try {
//       await createOrder({
//         vendorGroups,
//         shippingAddress: form,
//         paymentMethod: paymentId,
//         mobileNumber: mobile,
//       });
//       clearCart();
//       router.push('/');
//       alert('Order placed! 🎉');
//     } catch {
//       alert('Failed to place order. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">
//       {/* Top bar */}
//       <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
//         <Link
//           href="/cart"
//           className="text-sm text-gray-400 hover:text-green-600 transition w-16"
//         >
//           ← Cart
//         </Link>
//         <div className="flex items-center gap-2 text-sm font-semibold font-mono">
//           <span
//             className={step === 'payment' ? 'text-green-500' : 'text-green-600'}
//           >
//             {step === 'payment' && '✓ '}Shipping
//           </span>
//           <div className="w-8 h-px bg-gray-200" />
//           <span
//             className={step === 'payment' ? 'text-green-600' : 'text-gray-300'}
//           >
//             Payment
//           </span>
//         </div>
//         <div className="w-16" />
//       </div>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
//         {/* ═══ LEFT ═══ */}
//         <div>
//           {/* STEP 1 — Shipping */}
//           {step === 'shipping' && (
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
//               <div className="flex items-center gap-3 mb-7">
//                 <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
//                   📦
//                 </div>
//                 <div>
//                   <h2 className="font-bold text-gray-900 text-lg">
//                     Delivery Information
//                   </h2>
//                   <p className="text-gray-400 text-xs mt-0.5">
//                     Where should we send your order?
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
//                 <div className="sm:col-span-2">
//                   <FormField label="Full Name" required error={errors.fullName}>
//                     <input
//                       className={inputCls(errors.fullName)}
//                       value={form.fullName}
//                       onChange={(e) => setField('fullName', e.target.value)}
//                       placeholder="e.g. Lamin Ceesay"
//                     />
//                   </FormField>
//                 </div>

//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div
//                     className={`flex items-center rounded-xl border overflow-hidden bg-gray-50 transition
//                     focus-within:bg-white focus-within:ring-2 focus-within:ring-green-300 focus-within:border-green-400
//                     ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
//                   >
//                     <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-100 border-r border-gray-200 whitespace-nowrap shrink-0">
//                       🇬🇲 +220
//                     </span>
//                     <input
//                       className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-800"
//                       value={form.phone}
//                       onChange={(e) => setField('phone', e.target.value)}
//                       placeholder="7XX XXXX"
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Region" required error={errors.state}>
//                   <select
//                     className={inputCls(errors.state) + ' cursor-pointer'}
//                     value={form.state}
//                     onChange={(e) => setField('state', e.target.value)}
//                   >
//                     <option value="">Select Region</option>
//                     {GAMBIA_REGIONS.map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                 </FormField>

//                 <FormField label="City / Town" required error={errors.city}>
//                   <input
//                     className={inputCls(errors.city)}
//                     value={form.city}
//                     onChange={(e) => setField('city', e.target.value)}
//                     placeholder="e.g. Serrekunda"
//                   />
//                 </FormField>

//                 <FormField label="Postal Code">
//                   <input
//                     className={inputCls()}
//                     value={form.postalCode}
//                     onChange={(e) => setField('postalCode', e.target.value)}
//                     placeholder="Optional"
//                   />
//                 </FormField>

//                 <div className="sm:col-span-2">
//                   <FormField
//                     label="Delivery Address"
//                     required
//                     error={errors.address}
//                   >
//                     <input
//                       className={inputCls(errors.address)}
//                       value={form.address}
//                       onChange={(e) => setField('address', e.target.value)}
//                       placeholder="House no., street, landmark"
//                     />
//                   </FormField>
//                 </div>
//               </div>

//               {/* Delivery method */}
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
//                 Delivery Method
//               </p>
//               <div className="flex flex-col gap-3 mb-8">
//                 {DELIVERY_OPTIONS.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
//                       ${delivery === opt.id ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
//                   >
//                     <input
//                       type="radio"
//                       name="delivery"
//                       value={opt.id}
//                       checked={delivery === opt.id}
//                       onChange={() => setDelivery(opt.id)}
//                       className="sr-only"
//                     />
//                     <span className="text-2xl">
//                       {opt.id === 'standard' ? '🚚' : '⚡'}
//                     </span>
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-gray-800">
//                         {opt.label}
//                       </p>
//                       <p className="text-xs text-gray-400">{opt.desc}</p>
//                     </div>
//                     <span className="text-sm font-bold text-green-600">
//                       {opt.price}
//                     </span>
//                   </label>
//                 ))}
//               </div>

//               <button
//                 className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold text-sm transition-all"
//                 onClick={() => {
//                   if (validateShipping()) setStep('payment');
//                 }}
//               >
//                 Continue to Payment →
//               </button>
//             </div>
//           )}

//           {/* STEP 2 — Payment */}
//           {step === 'payment' && (
//             <form onSubmit={handleSubmit}>
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
//                     💳
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-gray-900 text-lg">
//                       Payment Method
//                     </h2>
//                     <p className="text-gray-400 text-xs mt-0.5">
//                       Choose how you'd like to pay
//                     </p>
//                   </div>
//                 </div>

//                 {/* Shipping summary */}
//                 <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-500 mb-6">
//                   <span className="shrink-0">📍</span>
//                   <span className="flex-1 truncate text-xs">
//                     {form.fullName} · {form.address}, {form.city}
//                   </span>
//                   <button
//                     type="button"
//                     className="text-green-600 font-semibold text-xs ml-2 shrink-0"
//                     onClick={() => setStep('shipping')}
//                   >
//                     Edit
//                   </button>
//                 </div>

//                 {/* Payment options */}
//                 <div className="flex flex-col gap-3 mb-5">
//                   {PAYMENT_METHODS.map((p) => (
//                     <label
//                       key={p.id}
//                       className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
//                         ${paymentId === p.id ? `${p.selectedBorder} ${p.selectedBg}` : 'border-gray-100 hover:border-gray-200'}`}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value={p.id}
//                         checked={paymentId === p.id}
//                         onChange={() => setPaymentId(p.id)}
//                         className="sr-only"
//                       />
//                       {p.logo}
//                       <div className="flex-1">
//                         <p className="text-sm font-bold text-gray-900">
//                           {p.name}
//                         </p>
//                         <p className="text-xs text-gray-400">{p.tagline}</p>
//                       </div>
//                       {paymentId === p.id && (
//                         <div
//                           className={`w-5 h-5 rounded-full ${p.checkBg} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
//                         >
//                           ✓
//                         </div>
//                       )}
//                     </label>
//                   ))}
//                 </div>

//                 {/* Mobile input for Wave / Africell */}
//                 {paymentId !== 'cash' && (
//                   <div
//                     className={`rounded-xl border-2 ${pm.noteBorder} ${pm.noteBg} p-4 mb-5`}
//                   >
//                     <div className="flex items-center gap-2 mb-3">
//                       {pm.logo}
//                       <div>
//                         <p className={`text-sm font-bold ${pm.textColor}`}>
//                           {pm.name} Number
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           We'll send a payment prompt to this number
//                         </p>
//                       </div>
//                     </div>
//                     <div
//                       className={`flex items-center rounded-xl border overflow-hidden bg-white transition
//                       focus-within:ring-2 focus-within:ring-green-300
//                       ${mobileErr ? 'border-red-400' : 'border-gray-200'}`}
//                     >
//                       <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-50 border-r border-gray-200 whitespace-nowrap shrink-0">
//                         🇬🇲 +220
//                       </span>
//                       <input
//                         className="flex-1 px-3 py-2.5 text-sm outline-none text-gray-800 bg-transparent"
//                         value={mobile}
//                         onChange={(e) => {
//                           setMobile(e.target.value);
//                           setMobileErr('');
//                         }}
//                         placeholder={
//                           paymentId === 'wave'
//                             ? 'Wave number'
//                             : 'Africell number'
//                         }
//                       />
//                     </div>
//                     {mobileErr && (
//                       <p className="mt-1.5 text-xs text-red-500">{mobileErr}</p>
//                     )}
//                     <p className="mt-3 text-xs text-gray-500 bg-white rounded-lg px-3 py-2 border border-white/80">
//                       {pm.note}
//                     </p>
//                   </div>
//                 )}

//                 {/* Cash note */}
//                 {paymentId === 'cash' && (
//                   <div className="flex gap-3 items-start bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3.5 mb-5 text-sm text-green-800">
//                     <span>💵</span>
//                     <p>
//                       Have the exact amount ready. Our agent will collect
//                       payment upon arrival.
//                     </p>
//                   </div>
//                 )}

//                 {/* Action buttons */}
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     className="px-5 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-300 transition"
//                     onClick={() => setStep('shipping')}
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isPending}
//                     className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed ${pm.btnBg}`}
//                   >
//                     {isPending ? (
//                       <>
//                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Pay ${formatCurrency(grandTotal)}`
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* ═══ RIGHT — Order Summary ═══ */}
//         <div className="lg:sticky lg:top-20">
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//             <h2 className="font-bold text-gray-900 text-base mb-5">
//               Order Summary
//             </h2>

//             {vendorGroups.map((group) => (
//               <div key={group.vendor?.id ?? 'unknown'} className="mb-4">
//                 <div className="flex items-center gap-1.5 mb-3">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
//                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">
//                     {group.vendor?.businessName}
//                   </p>
//                 </div>
//                 {group.items.map((item) => (
//                   <div
//                     key={item.product.id}
//                     className="flex items-center gap-3 py-2"
//                   >
//                     <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center text-lg shrink-0">
//                       {item.product.images?.[0] ? (
//                         <img
//                           src={item.product.images[0]}
//                           alt={item.product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         '🌿'
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-800 truncate">
//                         {item.product.name}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <span className="text-sm font-semibold text-gray-700 shrink-0">
//                       {formatCurrency(
//                         (item.product.discountPrice ?? item.product.price) *
//                           item.quantity,
//                       )}
//                     </span>
//                   </div>
//                 ))}
//                 <div className="flex justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
//                   <span>Subtotal</span>
//                   <span>{formatCurrency(group.subtotal)}</span>
//                 </div>
//               </div>
//             ))}

//             {/* Totals */}
//             <div className="border-t border-gray-100 pt-4 mt-2 space-y-2.5">
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>Subtotal</span>
//                 <span>{formatCurrency(totalAmount)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>Delivery</span>
//                 <span
//                   className={
//                     deliveryAmt === 0 ? 'text-green-600 font-semibold' : ''
//                   }
//                 >
//                   {deliveryAmt === 0 ? 'Free' : formatCurrency(deliveryAmt)}
//                 </span>
//               </div>
//               <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-3">
//                 <span>Total</span>
//                 <span className="text-green-700">
//                   {formatCurrency(grandTotal)}
//                 </span>
//               </div>
//             </div>

//             {/* Trust */}
//             <p className="text-center text-xs text-gray-300 mt-5 pt-4 border-t border-gray-50">
//               🔒 Secure checkout · Your data is protected
//             </p>
//             <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
//               <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-full">
//                 <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
//                 Wave
//               </span>
//               <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
//                 <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
//                 Africell
//               </span>
//               <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
//                 💵 Cash
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@/features/orders/hooks';
import { formatCurrency } from '@/lib/utils';
import { ShippingAddress } from '@/types/client';
import Link from 'next/link';

// ── Gambia Regions ─────────────────────────────────────────────────────────
const GAMBIA_REGIONS = [
  'Banjul',
  'Kanifing',
  'Brikama',
  'Mansakonko',
  'Kerewan',
  'Kuntaur',
  'Janjanbureh',
  'Basse',
];

// ── Payment Methods ────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'wave',
    name: 'Wave',
    tagline: 'Pay with Wave Mobile Money',
    selectedBorder: 'border-cyan-400',
    selectedBg: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    checkBg: 'bg-cyan-400',
    btnBg: 'bg-cyan-500 hover:bg-cyan-600',
    noteBorder: 'border-cyan-300',
    noteBg: 'bg-cyan-50',
    note: '💡 Open your Wave app and approve the payment request',
    logo: (
      <img
        src="https://play-lh.googleusercontent.com/NgAdQMq9Mu2NTJredx6COxScVB3tp153h_bVKQTXUt9Aou0Lz1PfffaQt5jFN9jlBfo"
        alt="Wave"
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
    ),
  },
  {
    id: 'afrimoney',
    name: 'Africell Money',
    tagline: 'Pay with Africell Mobile Money',
    selectedBorder: 'border-red-400',
    selectedBg: 'bg-red-50',
    textColor: 'text-red-600',
    checkBg: 'bg-red-500',
    btnBg: 'bg-red-500 hover:bg-red-600',
    noteBorder: 'border-red-200',
    noteBg: 'bg-red-50',
    note: '💡 You will receive an SMS to confirm payment on your Africell line',
    logo: (
      <img
        src="https://play-lh.googleusercontent.com/RdcJFPZm-crIFYqDz9RZiKpch3GZBNcCf1_gOefvjCYezabqjAZGwP_bw_hRSzMMpA"
        alt="Africell Money"
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
    ),
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    tagline: 'Pay when your order arrives',
    selectedBorder: 'border-green-400',
    selectedBg: 'bg-green-50',
    textColor: 'text-green-700',
    checkBg: 'bg-green-500',
    btnBg: 'bg-green-600 hover:bg-green-700',
    noteBorder: 'border-green-200',
    noteBg: 'bg-green-50',
    note: '',
    logo: (
      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-lg shrink-0">
        💵
      </div>
    ),
  },
];

const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    desc: '2–4 business days',
    price: 'Free',
    amount: 0,
  },
  {
    id: 'express',
    label: 'Express Delivery',
    desc: 'Same / next day',
    price: 'D150',
    amount: 150,
  },
];

// ── Tiny helpers ───────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none
   transition focus:bg-white focus:ring-2 focus:ring-green-300 focus:border-green-400
   ${err ? 'border-red-400' : 'border-gray-200'}`;

const FormField = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { vendorGroups, totalAmount, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const router = useRouter();

  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [paymentId, setPaymentId] = useState('wave');
  const [mobile, setMobile] = useState('');
  const [mobileErr, setMobileErr] = useState('');
  const [delivery, setDelivery] = useState('standard');
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  if (vendorGroups.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🛒</span>
        <p className="text-gray-400 text-sm">Your cart is empty.</p>
        <Link
          href="/products"
          className="text-green-600 font-semibold text-sm hover:underline"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  const pm = PAYMENT_METHODS.find((p) => p.id === paymentId)!;
  const deliveryAmt =
    DELIVERY_OPTIONS.find((d) => d.id === delivery)?.amount ?? 0;
  const grandTotal = totalAmount + deliveryAmt;

  const setField = (k: keyof ShippingAddress, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validateShipping = () => {
    const e: Partial<ShippingAddress> = {};
    if (!form.fullName) e.fullName = 'Required';
    if (!form.phone) e.phone = 'Required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.state) e.state = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePayment = () => {
    if (paymentId === 'cash') return true;
    if (!mobile) {
      setMobileErr('Mobile number is required');
      return false;
    }
    if (!/^(\+220|220)?[2-9]\d{6}$/.test(mobile.replace(/\s/g, ''))) {
      setMobileErr('Enter a valid Gambian number');
      return false;
    }
    setMobileErr('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;
    try {
      await createOrder({
        vendorGroups,
        shippingAddress: form,
        paymentMethod: paymentId,
        mobileNumber: mobile,
      });
      clearCart();
      router.push('/');
      alert('Order placed! 🎉');
    } catch {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/cart"
          className="text-sm text-gray-400 hover:text-green-600 transition w-16"
        >
          ← Cart
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold font-mono">
          <span
            className={step === 'payment' ? 'text-green-500' : 'text-green-600'}
          >
            {step === 'payment' && '✓ '}Shipping
          </span>
          <div className="w-8 h-px bg-gray-200" />
          <span
            className={step === 'payment' ? 'text-green-600' : 'text-gray-300'}
          >
            Payment
          </span>
        </div>
        <div className="w-16" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ═══ LEFT ═══ */}
        <div>
          {/* STEP 1 — Shipping */}
          {step === 'shipping' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
                  📦
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    Delivery Information
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                <div className="sm:col-span-2">
                  <FormField label="Full Name" required error={errors.fullName}>
                    <input
                      className={inputCls(errors.fullName)}
                      value={form.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      placeholder="e.g. Lamin Ceesay"
                    />
                  </FormField>
                </div>

                <FormField label="Phone Number" required error={errors.phone}>
                  <div
                    className={`flex items-center rounded-xl border overflow-hidden bg-gray-50 transition
                    focus-within:bg-white focus-within:ring-2 focus-within:ring-green-300 focus-within:border-green-400
                    ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-100 border-r border-gray-200 whitespace-nowrap shrink-0">
                      🇬🇲 +220
                    </span>
                    <input
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-800"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      placeholder="7XX XXXX"
                    />
                  </div>
                </FormField>

                <FormField label="Region" required error={errors.state}>
                  <select
                    className={inputCls(errors.state) + ' cursor-pointer'}
                    value={form.state}
                    onChange={(e) => setField('state', e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {GAMBIA_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="City / Town" required error={errors.city}>
                  <input
                    className={inputCls(errors.city)}
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                    placeholder="e.g. Serrekunda"
                  />
                </FormField>

                <FormField label="Postal Code">
                  <input
                    className={inputCls()}
                    value={form.postalCode}
                    onChange={(e) => setField('postalCode', e.target.value)}
                    placeholder="Optional"
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField
                    label="Delivery Address"
                    required
                    error={errors.address}
                  >
                    <input
                      className={inputCls(errors.address)}
                      value={form.address}
                      onChange={(e) => setField('address', e.target.value)}
                      placeholder="House no., street, landmark"
                    />
                  </FormField>
                </div>
              </div>

              {/* Delivery method */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Delivery Method
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
                      ${delivery === opt.id ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={delivery === opt.id}
                      onChange={() => setDelivery(opt.id)}
                      className="sr-only"
                    />
                    <span className="text-2xl">
                      {opt.id === 'standard' ? '🚚' : '⚡'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {opt.price}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold text-sm transition-all"
                onClick={() => {
                  if (validateShipping()) setStep('payment');
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 'payment' && (
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
                    💳
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">
                      Payment Method
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Choose how you'd like to pay
                    </p>
                  </div>
                </div>

                {/* Shipping summary */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-500 mb-6">
                  <span className="shrink-0">📍</span>
                  <span className="flex-1 truncate text-xs">
                    {form.fullName} · {form.address}, {form.city}
                  </span>
                  <button
                    type="button"
                    className="text-green-600 font-semibold text-xs ml-2 shrink-0"
                    onClick={() => setStep('shipping')}
                  >
                    Edit
                  </button>
                </div>

                {/* Payment options */}
                <div className="flex flex-col gap-3 mb-5">
                  {PAYMENT_METHODS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
                        ${paymentId === p.id ? `${p.selectedBorder} ${p.selectedBg}` : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={paymentId === p.id}
                        onChange={() => setPaymentId(p.id)}
                        className="sr-only"
                      />
                      {p.logo}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400">{p.tagline}</p>
                      </div>
                      {paymentId === p.id && (
                        <div
                          className={`w-5 h-5 rounded-full ${p.checkBg} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                        >
                          ✓
                        </div>
                      )}
                    </label>
                  ))}
                </div>

                {/* Mobile input for Wave / Africell */}
                {paymentId !== 'cash' && (
                  <div
                    className={`rounded-xl border-2 ${pm.noteBorder} ${pm.noteBg} p-4 mb-5`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {pm.logo}
                      <div>
                        <p className={`text-sm font-bold ${pm.textColor}`}>
                          {pm.name} Number
                        </p>
                        <p className="text-xs text-gray-400">
                          We'll send a payment prompt to this number
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center rounded-xl border overflow-hidden bg-white transition
                      focus-within:ring-2 focus-within:ring-green-300
                      ${mobileErr ? 'border-red-400' : 'border-gray-200'}`}
                    >
                      <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-50 border-r border-gray-200 whitespace-nowrap shrink-0">
                        🇬🇲 +220
                      </span>
                      <input
                        className="flex-1 px-3 py-2.5 text-sm outline-none text-gray-800 bg-transparent"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          setMobileErr('');
                        }}
                        placeholder={
                          paymentId === 'wave'
                            ? 'Wave number'
                            : 'Africell number'
                        }
                      />
                    </div>
                    {mobileErr && (
                      <p className="mt-1.5 text-xs text-red-500">{mobileErr}</p>
                    )}
                    <p className="mt-3 text-xs text-gray-500 bg-white rounded-lg px-3 py-2 border border-white/80">
                      {pm.note}
                    </p>
                  </div>
                )}

                {/* Cash note */}
                {paymentId === 'cash' && (
                  <div className="flex gap-3 items-start bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3.5 mb-5 text-sm text-green-800">
                    <span>💵</span>
                    <p>
                      Have the exact amount ready. Our agent will collect
                      payment upon arrival.
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-5 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-300 transition"
                    onClick={() => setStep('shipping')}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed ${pm.btnBg}`}
                  >
                    {isPending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatCurrency(grandTotal)}`
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ═══ RIGHT — Order Summary ═══ */}
        <div className="lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-base mb-5">
              Order Summary
            </h2>

            {vendorGroups.map((group) => (
              <div key={group.vendor?.id ?? 'unknown'} className="mb-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">
                    {group.vendor?.businessName}
                  </p>
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center text-lg shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '🌿'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 shrink-0">
                      {formatCurrency(
                        (item.product.discountPrice ?? item.product.price) *
                          item.quantity,
                      )}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
                  <span>Subtotal</span>
                  <span>{formatCurrency(group.subtotal)}</span>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 mt-2 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span
                  className={
                    deliveryAmt === 0 ? 'text-green-600 font-semibold' : ''
                  }
                >
                  {deliveryAmt === 0 ? 'Free' : formatCurrency(deliveryAmt)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-3">
                <span>Total</span>
                <span className="text-green-700">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Trust */}
            <p className="text-center text-xs text-gray-300 mt-5 pt-4 border-t border-gray-50">
              🔒 Secure checkout · Your data is protected
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-full">
                <img
                  src="https://play-lh.googleusercontent.com/NgAdQMq9Mu2NTJredx6COxScVB3tp153h_bVKQTXUt9Aou0Lz1PfffaQt5jFN9jlBfo"
                  alt="Wave"
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                />
                Wave
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                <img
                  src="https://play-lh.googleusercontent.com/RdcJFPZm-crIFYqDz9RZiKpch3GZBNcCf1_gOefvjCYezabqjAZGwP_bw_hRSzMMpA"
                  alt="Africell Money"
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                />
                Africell
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                💵 Cash
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
