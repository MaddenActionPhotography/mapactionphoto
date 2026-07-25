# Madden Action Photography — mapactionphoto.com

Today's Game. Tomorrow's Memory.

This is the Phase 1 public website: brand, pricing, athlete artwork lineup,
booking request, and gallery entry (visual only — backend wiring is Phase 2/3).

## Run it locally

You need Node.js 18 or newer (https://nodejs.org).

```
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (one-time setup, ~15 minutes)

1. Create a free account at https://github.com and https://vercel.com
   (sign in to Vercel *with* your GitHub account — easiest path).
2. Create a new GitHub repository called `mapactionphoto` and push this
   folder to it. If you've never used git:
   ```
   git init
   git add .
   git commit -m "Phase 1 site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mapactionphoto.git
   git push -u origin main
   ```
3. In Vercel: **Add New → Project → Import** the `mapactionphoto` repo.
   Accept the defaults (it auto-detects Next.js). Click **Deploy**.
4. You'll get a live preview URL like `mapactionphoto.vercel.app` within
   a minute. Every future `git push` redeploys automatically.

## Connect your domains

In the Vercel project: **Settings → Domains**.

1. Add `mapactionphoto.com` — set as **primary**.
2. Add `www.mapactionphoto.com` (Vercel will redirect it to the apex).
3. Add `madden-action-photography.com` — choose **Redirect to
   mapactionphoto.com**.

Vercel will show you the exact DNS records to add. In Squarespace
(**Domains → your domain → DNS Settings**) they will typically be:

| Type  | Host | Value                 |
|-------|------|-----------------------|
| A     | @    | 76.76.21.21           |
| CNAME | www  | cname.vercel-dns.com  |

Do this for **both** domains. Use the values Vercel displays if they
differ — Vercel verifies automatically once DNS propagates (minutes to
a few hours).

## What's next (build phases)

- **Phase 2 — Booking:** real availability calendar, booking requests
  stored in Supabase, $20 booking fee via Stripe/PayPal (Venmo supported
  through PayPal), email notifications.
- **Phase 3/4 — Gallery store:** private per-client galleries, automatic
  watermarked proofs, cart of favorites, checkout, and per-order 4-digit
  download codes that unlock clean high-resolution files. Manual code
  path for Venmo payments; automatic code issue for card/PayPal.
