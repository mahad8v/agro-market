// import dotenv from 'dotenv';
// dotenv.config();

// import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaClient } from '@prisma/client';
// import bcryptpkg from 'bcryptjs';

// const { hash } = bcryptpkg;

// const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
// const db = new PrismaClient({ adapter });

// async function main() {
//   console.log('🌱 Seeding database...');

//   const veg = await db.category.upsert({
//     where: { slug: 'vegetables' },
//     update: {},
//     create: {
//       name: 'Vegetables',
//       slug: 'vegetables',
//       icon: '🥬',
//       description: 'Fresh vegetables',
//     },
//   });
//   const fruit = await db.category.upsert({
//     where: { slug: 'fruits' },
//     update: {},
//     create: {
//       name: 'Fruits',
//       slug: 'fruits',
//       icon: '🍎',
//       description: 'Fresh fruits',
//     },
//   });
//   await db.category.upsert({
//     where: { slug: 'grains' },
//     update: {},
//     create: {
//       name: 'Grains',
//       slug: 'grains',
//       icon: '🌾',
//       description: 'Grains & cereals',
//     },
//   });
//   await db.category.upsert({
//     where: { slug: 'dairy' },
//     update: {},
//     create: {
//       name: 'Dairy',
//       slug: 'dairy',
//       icon: '🥛',
//       description: 'Dairy products',
//     },
//   });
//   await db.category.upsert({
//     where: { slug: 'poultry' },
//     update: {},
//     create: {
//       name: 'Poultry',
//       slug: 'poultry',
//       icon: '🐓',
//       description: 'Poultry & eggs',
//     },
//   });
//   await db.category.upsert({
//     where: { slug: 'spices' },
//     update: {},
//     create: {
//       name: 'Spices',
//       slug: 'spices',
//       icon: '🌶️',
//       description: 'Spices & seasonings',
//     },
//   });
//   console.log('✔ Categories seeded');

//   await db.user.upsert({
//     where: { email: 'admin@agrimarket.com' },
//     update: {},
//     create: {
//       name: 'Admin User',
//       email: 'admin@agrimarket.com',
//       password: await hash('admin123', 12),
//       role: 'ADMIN',
//     },
//   });
//   console.log('✔ Admin seeded');

//   const vu = await db.user.upsert({
//     where: { email: 'vendor@agrimarket.com' },
//     update: {},
//     create: {
//       name: 'James Mwangi',
//       email: 'vendor@agrimarket.com',
//       password: await hash('vendor123', 12),
//       role: 'VENDOR',
//     },
//   });
//   const vendor = await db.vendor.upsert({
//     where: { userId: vu.id },
//     update: {},
//     create: {
//       userId: vu.id,
//       businessName: 'Green Valley Farms',
//       slug: 'green-valley-farms',
//       description: 'Organic produce from the heart of the valley.',
//       location: 'Nakuru, Kenya',
//       phone: '+254712345678',
//       status: 'APPROVED',
//       isVerified: true,
//       commissionRate: 0.08,
//       subscriptionPlan: 'PRO',
//     },
//   });
//   console.log('✔ Vendor seeded');

//   await db.user.upsert({
//     where: { email: 'customer@agrimarket.com' },
//     update: {},
//     create: {
//       name: 'John Kamau',
//       email: 'customer@agrimarket.com',
//       password: await hash('customer123', 12),
//       role: 'CUSTOMER',
//     },
//   });
//   console.log('✔ Customer seeded');

//   await db.product.upsert({
//     where: { slug: 'organic-tomatoes' },
//     update: {},
//     create: {
//       name: 'Red Chilli Pepper',
//       slug: 'red-chilli-pepper',
//       description: 'Sun-dried red chilli peppers, rich in flavour.',
//       price: 350,
//       stock: 150,
//       unit: 'KG',
//       images: [
//         'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop',
//       ],

//       isOrganic: true,
//       isFeatured: true,
//       location: 'Mombasa',
//       vendorId: vendor.id,
//       categoryId: spices.id,
//     },
//   });
//   await db.product.upsert({
//     where: { slug: 'avocados-hass' },
//     update: {},
//     create: {
//       name: 'Watermelon',
//       slug: 'watermelon',
//       description: 'Sweet, juicy watermelons straight from the farm.',
//       price: 200,
//       stock: 100,
//       unit: 'PIECE',
//       images: [
//         'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: false,
//       isFeatured: true,
//       location: 'Machakos',
//       vendorId: vendor.id,
//       categoryId: fruit.id,
//     },
//   });
//   console.log('✔ Products seeded');

//   console.log('\n✅ Seeding complete!');
//   console.log('   admin@agrimarket.com    / admin123');
//   console.log('   vendor@agrimarket.com   / vendor123');
//   console.log('   customer@agrimarket.com / customer123');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });
import dotenv from 'dotenv';
dotenv.config();

import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import bcryptpkg from 'bcryptjs';

const { hash } = bcryptpkg;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const veg = await db.category.upsert({
    where: { slug: 'vegetables' },
    update: {},
    create: {
      name: 'Vegetables',
      slug: 'vegetables',
      icon: '🥬',
      description: 'Fresh vegetables',
    },
  });
  const fruit = await db.category.upsert({
    where: { slug: 'fruits' },
    update: {},
    create: {
      name: 'Fruits',
      slug: 'fruits',
      icon: '🍎',
      description: 'Fresh fruits',
    },
  });
  const grains = await db.category.upsert({
    where: { slug: 'grains' },
    update: {},
    create: {
      name: 'Grains',
      slug: 'grains',
      icon: '🌾',
      description: 'Grains & cereals',
    },
  });
  const dairy = await db.category.upsert({
    where: { slug: 'dairy' },
    update: {},
    create: {
      name: 'Dairy',
      slug: 'dairy',
      icon: '🥛',
      description: 'Dairy products',
    },
  });
  const poultry = await db.category.upsert({
    where: { slug: 'poultry' },
    update: {},
    create: {
      name: 'Poultry',
      slug: 'poultry',
      icon: '🐓',
      description: 'Poultry & eggs',
    },
  });
  const spices = await db.category.upsert({
    where: { slug: 'spices' },
    update: {},
    create: {
      name: 'Spices',
      slug: 'spices',
      icon: '🌶️',
      description: 'Spices & seasonings',
    },
  });
  console.log('✔ Categories seeded');

  await db.user.upsert({
    where: { email: 'admin@agrimarket.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@agrimarket.com',
      password: await hash('admin123', 12),
      role: 'ADMIN',
    },
  });
  console.log('✔ Admin seeded');

  const vu = await db.user.upsert({
    where: { email: 'vendor@agrimarket.com' },
    update: {},
    create: {
      name: 'James Mwangi',
      email: 'vendor@agrimarket.com',
      password: await hash('vendor123', 12),
      role: 'VENDOR',
    },
  });
  const vendor = await db.vendor.upsert({
    where: { userId: vu.id },
    update: {},
    create: {
      userId: vu.id,
      businessName: 'Green Valley Farms',
      slug: 'green-valley-farms',
      description: 'Organic produce from the heart of the valley.',
      location: 'Nakuru, Kenya',
      phone: '+254712345678',
      status: 'APPROVED',
      isVerified: true,
      commissionRate: 0.08,
      subscriptionPlan: 'PRO',
    },
  });
  console.log('✔ Vendor seeded');

  await db.user.upsert({
    where: { email: 'customer@agrimarket.com' },
    update: {},
    create: {
      name: 'John Kamau',
      email: 'customer@agrimarket.com',
      password: await hash('customer123', 12),
      role: 'CUSTOMER',
    },
  });
  console.log('✔ Customer seeded');

  // ── Products ──────────────────────────────────────────────────────────────

  await db.product.upsert({
    where: { slug: 'organic-tomatoes' },
    update: {},
    create: {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides.',
      price: 120,
      discountPrice: 95,
      stock: 500,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Nakuru',
      vendorId: vendor.id,
      categoryId: veg.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'avocados-hass' },
    update: {},
    create: {
      name: 'Avocados (Hass)',
      slug: 'avocados-hass',
      description: 'Premium Hass avocados, export quality.',
      price: 85,
      stock: 1200,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Muranga',
      vendorId: vendor.id,
      categoryId: fruit.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'fresh-spinach' },
    update: {},
    create: {
      name: 'Fresh Spinach',
      slug: 'fresh-spinach',
      description: 'Tender baby spinach leaves, harvested daily.',
      price: 60,
      stock: 300,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Nakuru',
      vendorId: vendor.id,
      categoryId: veg.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'maize-flour' },
    update: {},
    create: {
      name: 'Maize Flour',
      slug: 'maize-flour',
      description: 'Finely milled maize flour, perfect for ugali.',
      price: 180,
      stock: 800,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Eldoret',
      vendorId: vendor.id,
      categoryId: grains.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'fresh-milk' },
    update: {},
    create: {
      name: 'Fresh Whole Milk',
      slug: 'fresh-milk',
      description: 'Pure whole milk from grass-fed cows.',
      price: 70,
      stock: 400,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Naivasha',
      vendorId: vendor.id,
      categoryId: dairy.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'free-range-eggs' },
    update: {},
    create: {
      name: 'Free Range Eggs',
      slug: 'free-range-eggs',
      description: 'Farm fresh free-range eggs, packed in trays of 30.',
      price: 450,
      stock: 200,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Kiambu',
      vendorId: vendor.id,
      categoryId: poultry.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'red-chilli-pepper' },
    update: {},
    create: {
      name: 'Red Chilli Pepper',
      slug: 'red-chilli-pepper',
      description: 'Sun-dried red chilli peppers, rich in flavour.',
      price: 350,
      stock: 150,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Mombasa',
      vendorId: vendor.id,
      categoryId: spices.id,
    },
  });

  await db.product.upsert({
    where: { slug: 'watermelon' },
    update: {},
    create: {
      name: 'Watermelon',
      slug: 'watermelon',
      description: 'Sweet, juicy watermelons straight from the farm.',
      price: 200,
      stock: 100,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Machakos',
      vendorId: vendor.id,
      categoryId: fruit.id,
    },
  });

  console.log('✔ Products seeded');
  console.log('\n✅ Seeding complete!');
  console.log('   admin@agrimarket.com    / admin123');
  console.log('   vendor@agrimarket.com   / vendor123');
  console.log('   customer@agrimarket.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
