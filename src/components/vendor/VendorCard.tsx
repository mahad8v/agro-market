// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Vendor } from '@/types';
// import { Badge, Card } from '@/components/ui';

// interface VendorCardProps {
//   vendor: Vendor;
// }

// export function VendorCard({ vendor }: VendorCardProps) {
//   return (
//     <Card hover className="overflow-hidden">
//       {/* Banner */}
//       <div className="relative h-24 bg-green-100">
//         <Image
//           src={vendor.banner || '/placeholder-banner.jpg'}
//           alt={vendor.businessName}
//           fill
//           className="object-cover"
//         />
//       </div>

//       <div className="p-4 -mt-8 relative">
//         {/* Logo */}
//         <div className="relative h-14 w-14 rounded-full border-2 border-white bg-white shadow overflow-hidden mb-2">
//           <Image
//             src={vendor.logo || '/placeholder-logo.jpg'}
//             alt={vendor.businessName}
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="flex items-start justify-between">
//           <div>
//             <Link href={`/vendors/${vendor.id}`}>
//               <h3 className="font-semibold text-gray-900 hover:text-green-700">{vendor.businessName}</h3>
//             </Link>
//             <p className="text-xs text-gray-500">📍 {vendor.location}</p>
//           </div>
//           <div className="flex flex-col items-end gap-1">
//             {vendor.isVerified && <Badge variant="green">✓ Verified</Badge>}
//             <Badge variant="gray">{vendor.subscriptionPlan}</Badge>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 mt-2">
//           <span className="text-yellow-400 text-sm">★</span>
//           <span className="text-sm font-medium text-gray-700">{vendor.rating.toFixed(1)}</span>
//           {vendor.totalProducts !== undefined && (
//             <span className="text-xs text-gray-400 ml-2">{vendor.totalProducts} products</span>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '@/types';
import { Badge, Card } from '@/components/ui';

interface VendorCardProps {
  vendor: Vendor;
}

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop';
const FALLBACK_LOGO =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop';

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Card hover className="overflow-hidden">
      {/* Banner */}
      <div className="relative h-24 bg-green-100">
        <Image
          src={vendor.banner || FALLBACK_BANNER}
          alt={vendor.businessName}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_BANNER;
          }}
        />
      </div>

      <div className="p-4 -mt-8 relative">
        {/* Logo */}
        <div className="relative h-14 w-14 rounded-full border-2 border-white bg-white shadow overflow-hidden mb-2">
          <Image
            src={vendor.logo || FALLBACK_LOGO}
            alt={vendor.businessName}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_LOGO;
            }}
          />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <Link href={`/vendors/${vendor.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-green-700">
                {vendor.businessName}
              </h3>
            </Link>
            <p className="text-xs text-gray-500">📍 {vendor.location}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {vendor.isVerified && <Badge variant="green">✓ Verified</Badge>}
            <Badge variant="gray">{vendor.subscriptionPlan}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-medium text-gray-700">
            {vendor.rating.toFixed(1)}
          </span>
          {vendor.totalProducts !== undefined && (
            <span className="text-xs text-gray-400 ml-2">
              {vendor.totalProducts} products
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
