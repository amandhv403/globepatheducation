# Globepath Education Advisory — Complete Project Guide

Thank you for choosing this build. This single document is everything you need to
understand, run, edit, and publish the website. Read Sections 1–3 first if you are
in a hurry.

---

## 1. WHAT YOU RECEIVED (in this ZIP)

This is a complete, production-ready **education consultancy website** with a
**private admin panel**. Every piece of content you see on the website can be
changed from the admin panel — no coding needed.

| Area | What it is |
|---|---|
| Public website | 14 main pages, 22 country pages, blog articles, events, forms |
| Admin panel | Login-protected dashboard for leads + all content |
| Database | PostgreSQL storing content, settings, images, enquiries |
| Media library | Upload photos and insert them into any slideshow |

### Folder map

```
src/app/                 Every page of the website
  page.tsx               The homepage
  [slug]/page.tsx        Country pages  (/study-in-italy)
  blog/[slug]/page.tsx   Blog articles
  admin/                 The admin panel (private)
  api/                   Server routes (forms, login, content saving)
src/components/          Reusable interface parts (sliders, forms, navigation)
src/lib/                 Content rules, database reads, admin security
src/db/                  Database tables (schema) and connection
public/images/           The photographs used on the website
docs/                    Extra written guide
README.md                This file
```

---

## 2. TECH STACK

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **PostgreSQL** database with **Drizzle ORM**
- **Lucide** icons
- No third-party services, no API keys, no hidden costs — it runs anywhere Node.js runs.

---

## 3. RUNNING IT ON YOUR OWN COMPUTER

```bash
npm install          # install once
npx drizzle-kit push # create the database tables (once)
npm run dev          # start for editing  -> http://localhost:3000
npm run build        # production build
npm run start        # production run
```

### Environment variables (the `.env` file)

| Variable | Required | Meaning |
|---|---|---|
| `DATABASE_URL` | Yes | Your PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | When live | Your real domain, e.g. `https://globepath.com.bd` |

The ZIP contains a working `.env` for local use. **Replace `DATABASE_URL` with
your own when you deploy to a hosting provider.**

---

## 4. THE ADMIN PANEL — START HERE

### 4.1 Create your administrator (one time only)

1. Visit `https://your-site/admin/setup`
2. Enter name, email, password (**minimum 10 characters**)
3. You are signed in automatically.

> The setup page closes **permanently** after the first account exists. Afterwards
> always go to `/admin/login`.

### 4.2 Security built in

- Passwords are salted and hashed (`scrypt`) — plain passwords are never stored.
- Login sessions are random tokens stored as hashes and expire after **8 hours**.
- Every admin page and admin API requires a valid session.
- Admin pages are blocked from search engines (`noindex`).
- If you are ever locked out, run this on your database, then visit `/admin/setup`:
  ```sql
  DELETE FROM admin_users;
  ```

### 4.3 Admin screens

| Screen | What you do there |
|---|---|
| **Overview** | Total leads, new leads, pipeline chart, recent enquiries |
| **Lead CRM** | Search, filter and open enquiries; change stage; add private notes; export CSV |
| **Content library** | All 9 types of website content |
| **Pages & banners** | Slideshow + headline + Google text for every page |
| **Site settings** | Contact details, homepage text, section headings, slideshow speed, SEO |
| **Media library** | Upload photos, copy a "slider line", delete images |
| **Guide** | Step-by-step instructions inside the panel |

### 4.4 Saving

Press **Save** in any form and the public website updates **immediately**.
No rebuild, no developer, no redeployment.

---

## 5. WHAT YOU CAN EDIT, AND WHERE IT APPEARS

### 5.1 Page banners (top slideshow of every page)

**Admin → Content library → Pages & banners**

Each of the 11 main pages has its own: small label, headline, introduction,
slideshow images and Google title/description. Country pages and blog articles
have their own "Banner images" field inside their own editor.

### 5.2 Homepage text

**Admin → Site settings**, tabs:

- **Homepage banner** — headline, highlighted words, introduction, tick badges, image card, blue strip
- **Homepage sections** — every heading and paragraph
- **Profile & visa sections** — those two blocks
- **Journey, parents & why us** — timeline steps, parents text, reasons list
- **Consultation section** — the form block

### 5.3 "Where to show" tick boxes (important)

Inside each post or listing you will find **tick boxes choosing where it appears:**

| Content | Tick boxes |
|---|---|
| Universities | Homepage · Universities page · Country page |
| Destinations | Homepage · Study abroad page · Destination finder |
| Blog articles | Homepage · Education hub page |
| Events | Homepage · Events page |
| Services | Homepage · Services page |
| Scholarships | Homepage · Scholarships page |
| Student stories | Homepage · About page |

Unticking removes it from that section without deleting it. The list view shows
where every item currently appears.

### 5.4 Universities on country pages

When you add a university, choose its **Country** from the dropdown. It then
appears automatically on that country's page. If you rename a country, its
universities stay linked automatically.

### 5.5 Slideshows (images)

Every photo area is a slideshow with a slow 1.6-second cross-fade and a gentle
zoom. In the editor press **Add images**, click photos to select (or **Upload new**
on the spot), then use arrows to reorder and **×** to remove.

**Slideshow speed:** Site settings → Slideshow & SEO → *Seconds per slide* (3–15).

### 5.6 Student stories

Stories only appear on the website if you tick **"Written permission received"**.
This protects you from ever publishing an unapproved testimonial.

### 5.7 Writing rich text (blog + page bodies)

- Blank line = new paragraph
- Line starting with `## ` = heading
- Lines starting with `- ` = bullet list

---

## 6. GOING LIVE ON YOUR OWN DOMAIN

### Step 1 — Hosting
Deploy to any platform that runs Next.js + PostgreSQL: **Vercel**, **Render**,
**Railway**, DigitalOcean, Hetzner, or your own VPS.

### Step 2 — Database
Create a managed PostgreSQL database and copy its connection string.

### Step 3 — Environment variables
Set in your hosting dashboard:

```
DATABASE_URL=postgresql://user:pass@host:5432/globepath?sslmode=require
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 4 — Create the tables (once)
```bash
npx drizzle-kit push
```
This creates: `education_leads`, `profile_assessments`, `admin_users`,
`admin_sessions`, `content_entries`, `site_settings`, `media_assets`.

### Step 5 — Deploy
```bash
npm install && npm run build && npm run start
```
Or connect your Git repository and let the platform build automatically.

### Step 6 — Domain DNS
In your domain registrar's DNS panel (BTCL for `.com.bd` domains):

| Type | Host | Value |
|---|---|---|
| A | `@` | IPv4 address given by your host |
| CNAME | `www` | your host's domain (e.g. `cname.vercel-dns.com`) |

### Step 7 — Finish
1. Enable HTTPS (automatic on most platforms).
2. Visit `/admin/setup` and create your live administrator.
3. Site settings → **Live website address** = your real domain
   (this powers canonical URLs, sitemap and social sharing).
4. Google Search Console → verify → submit `https://yourdomain.com/sitemap.xml`.

Sitemap and `robots.txt` are generated automatically and include every page,
country and article.

---

## 7. CONTENT RULES THAT PROTECT YOUR BUSINESS

**Never publish:**
- "100% visa guarantee", "guaranteed admission", "guaranteed scholarship",
  "guaranteed job" or "guaranteed PR"
- Invented student numbers, visa success rates, rankings, scholarship amounts,
  or university partnerships

**Always:**
- Keep tuition, scholarship and visa wording as guidance to verify officially
- Only publish student stories with written permission
- Confirm fees and requirements on the official university website

---

## 8. WHAT IS NOT YET EDITABLE (honest list)

These are hard-coded and would need a developer:

1. **Menu link names** and button labels such as "Book a consultation"
2. **Fixed tips** on country pages ("Before you apply…" list)
3. The navigation order of the main menu

Everything else you can see is editable from the admin panel.

---

## 9. TROUBLESHOOTING

| Problem | Fix |
|---|---|
| "Page couldn't load" | The server stopped. Restart it and use the **newest** URL — old links expire |
| 404 on a new country page | The destination must be marked **Published** and shown on the Study abroad page |
| Image doesn't appear | Use **Add images** in the editor, not a raw link, and press Save |
| Admin redirecting to login | Your session expired after 8 hours — sign in again |
| Locked out of admin | Run `DELETE FROM admin_users;` then visit `/admin/setup` |
| Changes not visible | Check you pressed **Save**, then hard-refresh (`Ctrl+Shift+R`) |

---

## 10. PROJECT STATUS

✅ Production build passing
✅ TypeScript validation passing
✅ Route generation passing
✅ Database schema applied
✅ Health check passing
✅ All 21 routes returning HTTP 200
✅ Admin authentication, content editing, media upload, lead capture
   tested end-to-end

---

*Built for Globepath Education Advisory — Bangladesh.*
*Trust, guidance, clarity and long-term student support.*
