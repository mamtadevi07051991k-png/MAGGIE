# Maggie Lover shared apps — setup

Both apps use the same Supabase project (`mokoabblzmskesawmdeo`). The Customer App reads the shared active catalog/settings and inserts orders. The Admin App reads orders and manages products, categories, discounts, store open/closed status, and delivery details.

## Setup (one-time)
1. In Supabase Authentication > Users, create the admin email/password account.
2. Open `Maggie_Lover_Shared_Database_Setup_FIXED.sql` in Supabase SQL Editor. Replace `admin@example.com` at the bottom with the exact admin email you created, then run the whole script. It is non-destructive and does not drop existing tables.
3. Host both apps on HTTPS (not `file://`) for browser notifications and reliable web APIs.
4. Sign in to Admin App using that Supabase account. If it says permission denied, confirm that the SQL was run in the same project and the admin email step inserted one row into `public.admin_users`.

## Live sync
- Admin product/price/stock/category/discount/store-open changes are polled by the Customer App about every 10 seconds.
- Customer orders are polled by Admin App about every 5 seconds.
- Admin order detail supports status, delivery partner name/phone and tracking code.
- Browser notifications and a short sound can notify new orders while the Admin App is open and notification permission is granted. True push notifications while the browser/app is closed require a push service (VAPID/FCM) and a deployed server/Edge Function; this static ZIP alone cannot deliver background push.

Never place a Supabase service-role key in either app. Only the publishable key is used in the browser.
