# Impact Studio AI Migration — Intake App

Conversational intake form for The Migration service. Built with Next.js, deployed on Vercel, emails via Resend.

---

## Stack
- **Next.js 14** — framework
- **Resend** — email delivery
- **Vercel** — hosting

---

## Local Setup

```bash
git clone <repo>
cd impact-migration
npm install
cp .env.example .env.local
# Fill in your .env.local values (see below)
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key (resend.com/api-keys) |
| `INTAKE_TO_EMAIL` | `tamar@podcastimpactstudio.com` |
| `INTAKE_FROM_EMAIL` | `migration@podcastimpactstudio.com` |

> **Important:** `INTAKE_FROM_EMAIL` domain must be verified in Resend.
> Go to resend.com → Domains → Add `podcastimpactstudio.com` and add the DNS records.

---

## Vercel Deploy

```bash
npm i -g vercel
vercel
# Follow prompts — link to your Vercel account/team
# Add environment variables when prompted or via dashboard
```

Or connect the GitHub repo in Vercel dashboard for auto-deploys on push.

---

## Custom Domain

In Vercel → Project → Settings → Domains:
Add `migration.podcastimpactstudio.com`

Then add a CNAME record in your DNS:
```
migration → cname.vercel-dns.com
```

---

## How It Works

1. User fills out the conversational intake (talk to text supported)
2. On submit → `POST /api/submit` → Resend sends formatted email to Tamar
3. Confirmation page shows the ChatGPT prompt + booking link
4. Tamar receives intake, reviews before call, shows up prepared

---

## Files

```
pages/
  index.js          — Main intake form (all questions + flow)
  api/
    submit.js       — Resend email API route
styles/
  globals.css       — Base styles
.env.example        — Environment variable template
```

---

## Updating Questions

All questions live in the `sections` array at the top of `pages/index.js`.

Each question object:
```js
{
  id: 'unique_id',           // used as answer key
  section: 'Section Name',   // displayed above question
  question: 'The question?', // main question text
  hint: 'Optional hint',     // smaller helper text (optional)
  placeholder: 'Placeholder text',
  type: 'short' | 'long'    // short = input, long = textarea
}
```

---

Built by Podcast Impact Studio · podcastimpactstudio.com
