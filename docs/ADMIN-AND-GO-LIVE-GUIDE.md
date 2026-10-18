# Globepath — Admin Panel & Go-Live Guide

This guide explains how to launch the website on your own domain, set up the admin panel, and change every piece of content yourself — no developer required for day-to-day updates.

---

## 1. What you can edit from the admin panel

Open `/admin` and sign in. Everything below is editable from the browser.

| Admin section | What it controls on the website |
|---|---|
| **Site settings** | Company name, tagline, hero headline and highlighted words, hero paragraph, phone, WhatsApp, email, opening hours, office address, Google Map, social links, default SEO title and description, live website address |
| **Content library → Study destinations** | All country guides, each published at `/study-in-italy`, `/study-in-uk`, etc. Includes levels, fields, tuition, scholarship, visa and requirement text |
| **Content library → Universities** | Every university card in the finder: city, country, overview, levels, subjects, requirements, tuition, scholarships, intakes, official website |
| **Content library → Services** | The 12 advisory service cards (title, icon, description, order) |
| **Content library → Course fields** | The subject cards on the Courses page |
| **Content library → Scholarship categories** | The funding categories on the Scholarships page |
| **Content library → Education hub** | Full blog articles with headings, paragraphs and lists, plus category, reading time and SEO |
| **Content library → Events & seminars** | Event topic, type, date, time, location, speaker and registration link |
| **Lead CRM** | Every enquiry from the consultation form, profile assessment and destination finder, with stages and private notes |

Saving any content or setting refreshes the public website immediately. You do **not** need to rebuild or redeploy.

---

## 2. Set up the admin panel

### First administrator

1. Visit `https://YOUR-DOMAIN/admin/setup`.
2. Enter your name, email and a password of at least 10 characters.
3. Save the password in a password manager. It is stored only as a salted hash and cannot be recovered.
4. You are signed in and taken to the dashboard.

The setup page **closes permanently** once the first administrator exists. After that, sign in at `/admin/login`.

### Security built in

- Passwords are salted and hashed with Node's `scrypt`. Plain passwords are never stored.
- Sessions are random tokens stored as SHA-256 hashes, expire after 8 hours, and are deleted automatically when they expire.
- All admin pages and APIs require a valid session.
- Admin pages are marked `noindex, nofollow`, so search engines never list them.
- The public website is never able to write to the database.

### If you are locked out

An administrator with database access can remove the account so setup reopens:

```sql
DELETE FROM admin_users;
```

Then visit `/admin/setup` again. Only do this on a trusted, private database.

---

## 3. Configure your business information first

Do this before anything else — it updates the header, footer, contact page, WhatsApp buttons and search results.

1. Go to **Site settings**.
2. Fill in **Contact details**: phone, WhatsApp number (digits only, with country code, e.g. `8801828547270`), email, opening hours, office address.
3. For the map: open Google Maps → **Share** → **Embed a map** → copy only the link inside `src="..."` and paste it into **Google Maps embed link**.
4. Update **Brand & homepage** if you want different hero wording.
5. Add social links. Any field left blank hides that link automatically.
6. Press **Save website settings**.

---

## 4. Edit content day to day

1. Open **Content library** and pick a section.
2. Click a title to edit, or press **Add new**.
3. Key fields:
   - **URL address (slug)** controls the public link. `study-in-italy` → `/study-in-italy`.
   - **Published on website** hides an entry without deleting it.
   - **Display order** controls position. Lower numbers come first.
   - **SEO title / SEO description** override what Google shows for that page.
4. Press **Save changes**. The site updates immediately.
5. Use **View on website** to confirm the result.

### Writing article content

In the **Article content** box:

- Leave a blank line between paragraphs.
- Start a line with `##` to make a heading.
- Start lines with `-` to make a bullet list.

---

## 5. Go live on your own domain

### Step 1 — Choose hosting

Any platform that runs Next.js and PostgreSQL works: Vercel, Render, Railway, DigitalOcean, Hetzner or your own VPS.

### Step 2 — Create the database

Create a managed PostgreSQL database and copy the connection string, for example:

```
postgresql://user:password@host:5432/globepath?sslmode=require
```

### Step 3 — Set environment variables

In your hosting dashboard add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | your PostgreSQL connection string | Required |
| `NEXT_PUBLIC_SITE_URL` | `https://globepath.com.bd` | Your live domain, with https |

Nothing else is required. There are no hardcoded passwords or API keys.

### Step 4 — Create the database tables

Run this once from the project folder with `DATABASE_URL` pointing at your live database:

```bash
npx drizzle-kit push
```

This creates `education_leads`, `profile_assessments`, `admin_users`, `admin_sessions`, `content_entries` and `site_settings`.

### Step 5 — Deploy the project

```bash
npm install
npm run build
npm run start
```

Or connect your Git repository to the platform and let it build automatically.

### Step 6 — Point your domain to the host

In your domain provider's DNS panel (for a `.com.bd` domain this is usually BTCL or your registrar):

| Record type | Host | Value |
|---|---|---|
| `A` | `@` | the IPv4 address your host gives you |
| `CNAME` | `www` | your host's domain, e.g. `cname.vercel-dns.com` |

DNS normally propagates within 15 minutes to a few hours.

### Step 7 — Enable HTTPS and create the live admin

- Enable HTTPS/SSL in your host settings (automatic on Vercel, Render and similar platforms).
- Visit `https://YOUR-DOMAIN/admin/setup` and create your administrator account.
- Go to **Site settings** and confirm **Live website address** is your real domain — this powers canonical URLs, the sitemap and social sharing.

### Step 8 — Submit to Google

- Google Search Console → add your domain → verify.
- Submit `https://YOUR-DOMAIN/sitemap.xml`.
- Your sitemap and `robots.txt` are generated automatically and include every destination and article you publish.

---

## 6. Responsibilities after launch

- Update event dates, deadlines and intake information regularly.
- Review destination, tuition and visa text each intake cycle and confirm details with official sources.
- Add real student stories only with written permission and verified facts.
- Back up the database periodically — it now holds all of your content.

---

## 7. Content rules that protect your reputation

Never publish:

- "100% visa guarantee", "guaranteed admission", "guaranteed scholarship", "guaranteed job" or "guaranteed PR".
- Invented student numbers, visa success rates, rankings, scholarship amounts or university partnerships.

Always keep tuition, scholarship and visa wording as guidance that students should verify with official sources. This is a legal and reputational safeguard, and it is also why the website currently uses careful wording everywhere.
