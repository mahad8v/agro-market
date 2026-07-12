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
//   const grains = await db.category.upsert({
//     where: { slug: 'grains' },
//     update: {},
//     create: {
//       name: 'Grains',
//       slug: 'grains',
//       icon: '🌾',
//       description: 'Grains & cereals',
//     },
//   });
//   const dairy = await db.category.upsert({
//     where: { slug: 'dairy' },
//     update: {},
//     create: {
//       name: 'Dairy',
//       slug: 'dairy',
//       icon: '🥛',
//       description: 'Dairy products',
//     },
//   });
//   const poultry = await db.category.upsert({
//     where: { slug: 'poultry' },
//     update: {},
//     create: {
//       name: 'Poultry',
//       slug: 'poultry',
//       icon: '🐓',
//       description: 'Poultry & eggs',
//     },
//   });
//   const spices = await db.category.upsert({
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
//       name: 'Sheikh Joof',
//       email: 'admin@agrimarket.com',
//       password: await hash('admin@agrimarket.com', 12),
//       role: 'ADMIN',
//     },
//   });
//   console.log('✔ Admin seeded');

//   const vu = await db.user.upsert({
//     where: { email: 'vendor@agrimarket.com' },
//     update: {},
//     create: {
//       name: 'Fatima Joof',
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
//       name: 'Omar Ceesay',
//       email: 'customer@agrimarket.com',
//       password: await hash('customer123', 12),
//       role: 'CUSTOMER',
//     },
//   });
//   console.log('✔ Customer seeded');

//   // ── Products ──────────────────────────────────────────────────────────────

//   await db.product.upsert({
//     where: { slug: 'organic-tomatoes' },
//     update: {},
//     create: {
//       name: 'Organic Tomatoes',
//       slug: 'organic-tomatoes',
//       description: 'Fresh organic tomatoes grown without pesticides.',
//       price: 120,
//       discountPrice: 95,
//       stock: 500,
//       unit: 'KG',
//       images: [
//         'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800&auto=format&fit=crop',
//         'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: true,
//       isFeatured: true,
//       location: 'Banjul',
//       vendorId: vendor.id,
//       categoryId: veg.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'avocados-hass' },
//     update: {},
//     create: {
//       name: 'Avocados (Hass)',
//       slug: 'avocados-hass',
//       description: 'Premium Hass avocados, export quality.',
//       price: 85,
//       stock: 1200,
//       unit: 'PIECE',
//       images: [
//         'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800&auto=format&fit=crop',
//         'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: true,
//       isFeatured: true,
//       location: 'Bijilo',
//       vendorId: vendor.id,
//       categoryId: fruit.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'fresh-spinach' },
//     update: {},
//     create: {
//       name: 'Fresh Spinach',
//       slug: 'fresh-spinach',
//       description: 'Tender baby spinach leaves, harvested daily.',
//       price: 60,
//       stock: 300,
//       unit: 'KG',
//       images: [
//         'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: true,
//       isFeatured: true,
//       location: 'Serrekunda',
//       vendorId: vendor.id,
//       categoryId: veg.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'maize-flour' },
//     update: {},
//     create: {
//       name: 'Maize Flour',
//       slug: 'maize-flour',
//       description: 'Finely milled maize flour, perfect for ugali.',
//       price: 180,
//       stock: 800,
//       unit: 'BAG',
//       images: [
//         'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: false,
//       isFeatured: true,
//       location: 'Bakau',
//       vendorId: vendor.id,
//       categoryId: grains.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'fresh-milk' },
//     update: {},
//     create: {
//       name: 'Fresh Whole Milk',
//       slug: 'fresh-milk',
//       description: 'Pure whole milk from grass-fed cows.',
//       price: 70,
//       stock: 400,
//       unit: 'BAG',
//       images: [
//         'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: true,
//       isFeatured: true,
//       location: 'Bijilo',
//       vendorId: vendor.id,
//       categoryId: dairy.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'free-range-eggs' },
//     update: {},
//     create: {
//       name: 'Free Range Eggs',
//       slug: 'free-range-eggs',
//       description: 'Farm fresh free-range eggs, packed in trays of 30.',
//       price: 450,
//       stock: 200,
//       unit: 'PIECE',
//       images: [
//         'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop',
//       ],
//       isOrganic: true,
//       isFeatured: true,
//       location: 'Bakau',
//       vendorId: vendor.id,
//       categoryId: poultry.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'red-chilli-pepper' },
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
//       location: 'Brikama',
//       vendorId: vendor.id,
//       categoryId: spices.id,
//     },
//   });

//   await db.product.upsert({
//     where: { slug: 'watermelon' },
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
//       location: 'Banjul',
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

  // ── Categories ────────────────────────────────────────────────────────────

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
  const legumes = await db.category.upsert({
    where: { slug: 'legumes' },
    update: {},
    create: {
      name: 'Legumes',
      slug: 'legumes',
      icon: '🫘',
      description: 'Beans, lentils & pulses',
    },
  });
  const herbs = await db.category.upsert({
    where: { slug: 'herbs' },
    update: {},
    create: {
      name: 'Herbs',
      slug: 'herbs',
      icon: '🌿',
      description: 'Fresh & dried herbs',
    },
  });
  console.log('✔ Categories seeded');

  // ── Admin ─────────────────────────────────────────────────────────────────

  await db.user.upsert({
    where: { email: 'admin@senela.com' },
    update: {},
    create: {
      name: 'Sheikh Joof',
      email: 'admin@senela.com',
      password: await hash('admin123', 12),
      role: 'ADMIN',
    },
  });
  console.log('✔ Admin seeded');

  // ── Vendors ───────────────────────────────────────────────────────────────

  const vendorDefs = [
    {
      email: 'vendor@senela.com',
      password: 'vendor123',
      name: 'Fatima Joof',
      businessName: 'Green Valley Farms',
      slug: 'green-valley-farms',
      description: 'Organic produce from the heart of the valley.',
      location: 'Nakuru, Kenya',
      phone: '+254712345678',
      commissionRate: 0.08,
      subscriptionPlan: 'PRO',
    },
    {
      email: 'sunrise@senela.com',
      password: 'vendor123',
      name: 'Lamin Sanneh',
      businessName: 'Sunrise Organic Market',
      slug: 'sunrise-organic-market',
      description: 'Sun-ripened fruits and vegetables grown with care.',
      location: 'Brikama, Gambia',
      phone: '+220712345001',
      commissionRate: 0.07,
      subscriptionPlan: 'FREE',
    },
    {
      email: 'coastal@senela.com',
      password: 'vendor123',
      name: 'Mariama Touray',
      businessName: 'Coastal Fresh Produce',
      slug: 'coastal-fresh-produce',
      description: 'Coastal-grown produce delivered fresh daily.',
      location: 'Bakau, Gambia',
      phone: '+220712345002',
      commissionRate: 0.09,
      subscriptionPlan: 'PRO',
    },
    {
      email: 'goldenharvest@senela.com',
      password: 'vendor123',
      name: 'Ebrima Ceesay',
      businessName: 'Golden Harvest Co-op',
      slug: 'golden-harvest-coop',
      description:
        'A farmer co-operative supplying grains, legumes and staples.',
      location: 'Farafenni, Gambia',
      phone: '+220712345003',
      commissionRate: 0.06,
      subscriptionPlan: 'FREE',
    },
  ];

  const vendors = {};

  for (const v of vendorDefs) {
    const user = await db.user.upsert({
      where: { email: v.email },
      update: {},
      create: {
        name: v.name,
        email: v.email,
        password: await hash(v.password, 12),
        role: 'VENDOR',
      },
    });

    const vendor = await db.vendor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: v.businessName,
        slug: v.slug,
        description: v.description,
        location: v.location,
        phone: v.phone,
        status: 'APPROVED',
        isVerified: true,
        commissionRate: v.commissionRate,
        subscriptionPlan: v.subscriptionPlan,
      },
    });

    vendors[v.slug] = vendor;
  }
  console.log('✔ Vendors seeded');

  // ── Customers ─────────────────────────────────────────────────────────────

  const customerDefs = [
    { name: 'Omar Ceesay', email: 'customer1@senela.com' },
    { name: 'Aminata Bah', email: 'customer2@senela.com' },
    { name: 'Modou Jallow', email: 'customer3@senela.com' },
    { name: 'Isatou Sowe', email: 'customer4@senela.com' },
    { name: 'Bakary Njie', email: 'customer5@senela.com' },
    { name: 'Fatoumata Camara', email: 'customer6@senela.com' },
    { name: 'Alieu Drammeh', email: 'customer7@senela.com' },
  ];

  for (const c of customerDefs) {
    await db.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        password: await hash('customer123', 12),
        role: 'CUSTOMER',
      },
    });
  }
  console.log('✔ Customers seeded');

  // ── Products ──────────────────────────────────────────────────────────────

  const productDefs = [
    // Green Valley Farms
    {
      vendor: 'green-valley-farms',
      slug: 'organic-tomatoes',
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides.',
      price: 120,
      discountPrice: 95,
      stock: 500,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Banjul',
      categoryId: veg.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'avocados-hass',
      name: 'Avocados (Hass)',
      description: 'Premium Hass avocados, export quality.',
      price: 85,
      stock: 1200,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Bijilo',
      categoryId: fruit.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'fresh-spinach',
      name: 'Fresh Spinach',
      description: 'Tender baby spinach leaves, harvested daily.',
      price: 60,
      stock: 300,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Serrekunda',
      categoryId: veg.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'maize-flour',
      name: 'Maize Flour',
      description: 'Finely milled maize flour, perfect for ugali.',
      price: 180,
      stock: 800,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Bakau',
      categoryId: grains.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'fresh-milk',
      name: 'Fresh Whole Milk',
      description: 'Pure whole milk from grass-fed cows.',
      price: 70,
      stock: 400,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Bijilo',
      categoryId: dairy.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'free-range-eggs',
      name: 'Free Range Eggs',
      description: 'Farm fresh free-range eggs, packed in trays of 30.',
      price: 450,
      stock: 200,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Bakau',
      categoryId: poultry.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'red-chilli-pepper',
      name: 'Red Chilli Pepper',
      description: 'Sun-dried red chilli peppers, rich in flavour.',
      price: 350,
      stock: 150,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Brikama',
      categoryId: spices.id,
    },
    {
      vendor: 'green-valley-farms',
      slug: 'watermelon',
      name: 'Watermelon',
      description: 'Sweet, juicy watermelons straight from the farm.',
      price: 200,
      stock: 100,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Banjul',
      categoryId: fruit.id,
    },

    // Sunrise Organic Market
    {
      vendor: 'sunrise-organic-market',
      slug: 'sweet-mangoes',
      name: 'Sweet Mangoes',
      description: 'Juicy, tree-ripened mangoes.',
      price: 90,
      stock: 600,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Brikama',
      categoryId: fruit.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'okra',
      name: 'Fresh Okra',
      description: 'Tender okra pods, great for soups and stews.',
      price: 75,
      stock: 250,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Brikama',
      categoryId: veg.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'sweet-potatoes',
      name: 'Sweet Potatoes',
      description: 'Naturally sweet, nutrient-rich sweet potatoes.',
      price: 65,
      stock: 400,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1596097635121-14b63b7a0c93?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Kanifing',
      categoryId: veg.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'pineapples',
      name: 'Pineapples',
      description: 'Golden, fragrant pineapples picked at peak ripeness.',
      price: 150,
      stock: 180,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Brikama',
      categoryId: fruit.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'fresh-mint',
      name: 'Fresh Mint',
      description: 'Aromatic fresh mint, perfect for attaya and teas.',
      price: 40,
      stock: 200,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Serrekunda',
      categoryId: herbs.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'groundnuts-raw',
      name: 'Raw Groundnuts',
      description: 'Farm-fresh raw groundnuts, sold by the kilo.',
      price: 130,
      stock: 350,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Brikama',
      categoryId: legumes.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'green-beans',
      name: 'Green Beans',
      description: 'Crisp, freshly picked green beans.',
      price: 85,
      stock: 220,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Kanifing',
      categoryId: veg.id,
    },
    {
      vendor: 'sunrise-organic-market',
      slug: 'papaya',
      name: 'Papaya',
      description: 'Sweet, ripe papayas rich in vitamin C.',
      price: 95,
      stock: 160,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: false,
      location: 'Brikama',
      categoryId: fruit.id,
    },

    // Coastal Fresh Produce
    {
      vendor: 'coastal-fresh-produce',
      slug: 'smoked-catfish',
      name: 'Smoked Catfish',
      description: 'Traditionally smoked catfish, a Gambian staple.',
      price: 550,
      stock: 90,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Bakau',
      categoryId: poultry.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'coconuts',
      name: 'Fresh Coconuts',
      description: 'Whole coconuts, hand-picked from coastal palms.',
      price: 110,
      stock: 240,
      unit: 'PIECE',
      images: [
        'https://images.unsplash.com/photo-1560769680-ba2f3767c785?w=500&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Bakau',
      categoryId: fruit.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'bell-peppers',
      name: 'Bell Peppers',
      description: 'Colourful, crunchy bell peppers.',
      price: 100,
      stock: 260,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Bakau',
      categoryId: veg.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'fresh-basil',
      name: 'Fresh Basil',
      description: 'Fragrant basil leaves picked fresh.',
      price: 45,
      stock: 150,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Bakau',
      categoryId: herbs.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'yogurt-plain',
      name: 'Plain Yogurt',
      description: 'Creamy plain yogurt made from fresh milk.',
      price: 90,
      stock: 300,
      unit: 'BAG',
      images: [
        'https://plus.unsplash.com/premium_photo-1713719216015-00a348bc4526?w=500&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Bakau',
      categoryId: dairy.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'cucumbers',
      name: 'Cucumbers',
      description: 'Cool, crisp cucumbers grown near the coast.',
      price: 55,
      stock: 320,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Bakau',
      categoryId: veg.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'garden-eggs',
      name: 'Garden Eggs',
      description: 'Small, tender garden eggs (African eggplant).',
      price: 70,
      stock: 180,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Serrekunda',
      categoryId: veg.id,
    },
    {
      vendor: 'coastal-fresh-produce',
      slug: 'limes',
      name: 'Fresh Limes',
      description: 'Zesty limes, great for juices and cooking.',
      price: 60,
      stock: 260,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Bakau',
      categoryId: fruit.id,
    },

    // Golden Harvest Co-op
    {
      vendor: 'golden-harvest-coop',
      slug: 'black-eyed-peas',
      name: 'Black-Eyed Peas',
      description: 'Dried black-eyed peas, high in protein.',
      price: 160,
      stock: 500,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1515347272087-685ce5a1fc8b?w=500&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Farafenni',
      categoryId: legumes.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'rice-local',
      name: 'Local Rice',
      description: 'Locally grown rice, sold in bulk bags.',
      price: 900,
      stock: 700,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Farafenni',
      categoryId: grains.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'millet',
      name: 'Millet',
      description: 'Whole grain millet, a nutritious staple.',
      price: 210,
      stock: 450,
      unit: 'BAG',
      images: [
        'https://plus.unsplash.com/premium_photo-1726750862897-4b75116bca34?w=500&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: false,
      location: 'Farafenni',
      categoryId: grains.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'lentils-red',
      name: 'Red Lentils',
      description: 'Fast-cooking red lentils, great for stews.',
      price: 190,
      stock: 300,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1614373532201-c40b993f0013?w=500&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: true,
      location: 'Farafenni',
      categoryId: legumes.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'sorghum',
      name: 'Sorghum',
      description: 'Traditional sorghum grain, versatile and hearty.',
      price: 175,
      stock: 380,
      unit: 'BAG',
      images: [
        'https://images.unsplash.com/photo-1616428088683-ad2e5f5c9884?w=500&auto=format&fit=crop',
      ],
      isOrganic: false,
      isFeatured: false,
      location: 'Farafenni',
      categoryId: grains.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'dried-hibiscus',
      name: 'Dried Hibiscus (Wonjo)',
      description: 'Dried hibiscus flowers for making wonjo juice.',
      price: 220,
      stock: 260,
      unit: 'KG',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: true,
      location: 'Farafenni',
      categoryId: spices.id,
    },
    {
      vendor: 'golden-harvest-coop',
      slug: 'cassava',
      name: 'Fresh Cassava',
      description: 'Freshly harvested cassava tubers.',
      price: 80,
      stock: 400,
      unit: 'KG',
      images: [
        'https://plus.unsplash.com/premium_photo-1725467479101-556af13a7220?w=500&auto=format&fit=crop',
      ],
      isOrganic: true,
      isFeatured: false,
      location: 'Farafenni',
      categoryId: veg.id,
    },
  ];

  for (const p of productDefs) {
    const vendor = vendors[p.vendor];
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        unit: p.unit,
        images: p.images,
        isOrganic: p.isOrganic,
        isFeatured: p.isFeatured,
        location: p.location,
        vendorId: vendor.id,
        categoryId: p.categoryId,
      },
    });
  }

  console.log(`✔ Products seeded (${productDefs.length} total)`);
  console.log('\n✅ Seeding complete!');
  console.log('   admin@senela.com          / admin123');
  console.log(
    '   vendor@senela.com         / vendor123   (Green Valley Farms)',
  );
  console.log(
    '   sunrise@senela.com        / vendor123   (Sunrise Organic Market)',
  );
  console.log(
    '   coastal@senela.com        / vendor123   (Coastal Fresh Produce)',
  );
  console.log(
    '   goldenharvest@senela.com  / vendor123   (Golden Harvest Co-op)',
  );
  console.log('   customer1@senela.com … customer7@senela.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
