🧠 AI BUILD PROPS
Project: Multi-Vendor Agricultural Marketplace
Stack: Next.js 14 (App Router) + TypeScript + Tailwind + React Query + Context API
1️⃣ GLOBAL REQUIREMENTS

Use App Router

Use TypeScript everywhere

Use Tailwind for styling

Use React Query for server state

Use Context API for auth

Feature-based architecture

Role-based route protection

Clean scalable architecture

Pages must remain thin

Business logic inside features/

2️⃣ ROLE SYSTEM

There are 3 roles:

customer
vendor
admin

Access Rules:

Route Access
(marketplace) Public
/vendor/_ Vendor only
/admin/_ Admin only

Implement middleware for protection.

3️⃣ DATA MODELS (AI MUST IMPLEMENT)
Product Model

id

name

slug

description

category

subCategory

price

discountPrice (optional)

stock

unit (kg, bag, crate, ton, piece)

images[]

isOrganic (boolean)

harvestDate

location

vendorId

rating

totalReviews

createdAt

Vendor Model

id

businessName

slug

description

logo

banner

ownerName

email

phone

location

rating

isVerified

commissionRate

subscriptionPlan (free | pro | enterprise)

Order Model

id

customerId

vendorId

items[]

totalAmount

commissionAmount

vendorEarning

paymentStatus (pending | paid | failed)

orderStatus (pending | confirmed | processing | shipped | delivered | cancelled)

createdAt

4️⃣ FOLDER RESPONSIBILITIES
📁 app/

Only routing + layouts.

No heavy logic.

(auth)
login/page.tsx

Login form

Email + password

On success → redirect based on role

register/page.tsx

Register form

Role selector (customer or vendor)

(marketplace)
page.tsx (Home)

Hero section

Featured products section

Featured vendors section

Categories section

products/page.tsx

Product grid

Filter sidebar

Search bar

Pagination

Uses React Query hook from features/products

products/[slug]/page.tsx

Product gallery

Product info

Vendor summary

Add to cart button

Related products

vendors/[vendorId]/page.tsx

Vendor banner

Vendor rating

Vendor description

Vendor product list

cart/page.tsx

Group products by vendor

Update quantity

Remove item

Show subtotal per vendor

Show total

checkout/page.tsx

Shipping form

Delivery selector

Order summary

Place order button

📁 vendor/

Protected: vendor only.

layout.tsx

Sidebar navigation:

Dashboard

Products

Orders

Analytics

Settings

Topbar

Logout button

dashboard/page.tsx

Show stats:

Total products

Total revenue

Total orders

Pending orders

products/page.tsx

Table of vendor products

Edit button

Delete button

Toggle stock

products/create/page.tsx

Form fields:

Name

Description

Category

Price

Discount price

Stock

Unit

Organic checkbox

Harvest date

Image upload

products/[id]/edit/page.tsx

Same as create

Pre-filled data

orders/page.tsx

Vendor orders only

Update order status dropdown

analytics/page.tsx

Revenue chart

Orders chart

settings/page.tsx

Update business info

Update profile

📁 admin/

Protected: admin only.

layout.tsx

Admin sidebar:

Dashboard

Vendors

Products

Orders

Categories

dashboard/page.tsx

Show:

Total vendors

Total products

Total orders

Platform revenue

vendors/page.tsx

Vendor table

Approve

Suspend

Delete

products/page.tsx

All products

Delete product

Feature product

orders/page.tsx

All orders

Update status

categories/page.tsx

Create category

Edit category

Delete category

5️⃣ features/

Each feature must contain:

api.ts
hooks.ts
types.ts
components/

Rules:

api.ts → HTTP calls

hooks.ts → React Query hooks

types.ts → TS interfaces

components/ → feature-specific UI

features/products/

Must include:

getProducts()

getProductBySlug()

createProduct()

updateProduct()

deleteProduct()

Hooks:

useProducts()

useProduct()

useCreateProduct()

useUpdateProduct()

features/vendors/

Must include:

getVendors()

getVendorById()

approveVendor()

suspendVendor()

features/orders/

Must include:

createOrder()

getVendorOrders()

getAdminOrders()

updateOrderStatus()

features/auth/

Must include:

login()

register()

logout()

getCurrentUser()

6️⃣ components/

Reusable UI components only.

components/ui/

Button

Input

Select

Modal

Card

Badge

components/product/

ProductCard

ProductGrid

ProductGallery

ProductFilters

components/vendor/

VendorCard

VendorStatsCard

components/cart/

CartItem

CartSummary

components/forms/

ProductForm

LoginForm

RegisterForm

7️⃣ services/

api.ts (fetch wrapper)

interceptors if needed

8️⃣ context/

AuthContext:

user

role

login()

logout()

isAuthenticated

9️⃣ CART LOGIC

Cart must:

Support multi-vendor

Group by vendor

Calculate subtotal per vendor

Calculate commission per order

Calculate total

🔟 COMMISSION SYSTEM

For each order:

commissionAmount = totalAmount \* vendor.commissionRate
vendorEarning = totalAmount - commissionAmount

Store both.

11️⃣ UI DESIGN RULES

Green agricultural theme

Modern clean layout

Dashboard with sidebar

Fully responsive

Use reusable UI components

12️⃣ CODE QUALITY RULES

Strong TypeScript types

No duplicated logic

Feature-based separation

Reusable hooks

Clean folder boundaries

Scalable structure
