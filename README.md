# Cybin Enterprises — Developer README

This document covers everything your development team needs to know to deploy, customize, integrate, and extend the Cybin Enterprises website.

---

## 🚀 Quick Reference (For Designers & Developers)

### 🎨 Designers — Where to Find & Update Things

| What You Need | Where to Go | File / Location |
|--------------|-------------|-----------------|
| **Logo** | Header & Footer | `src/frontend/public/assets/cybin-logo.png` |
| **Hero Images** | Home, About, Industry pages | `src/frontend/public/assets/generated/` |
| **Team Photos** | About, Team sections | `src/frontend/public/assets/mel-headshot.jpeg`, `shane-headshot.jpeg` |
| **Colors** | Theme colors | `src/frontend/src/lib/theme/tokens.ts` |
| **Fonts** | Typography | `src/frontend/src/lib/theme/tokens.ts` |
| **Site Text** | All page copy | `src/frontend/src/components/pages/` (each page) |
| **Blog Posts** | Blog section | `src/frontend/src/data/blogPosts.ts` |
| **Industries Data** | Industries page | `src/frontend/src/data/industries.ts` |
| **FAQ Content** | FAQ page | `src/frontend/src/components/pages/FaqPage.tsx` |

### 💻 Developers — Key Files & Commands

| What You Need | Location |
|--------------|----------|
| **Frontend Entry** | `src/frontend/src/App.tsx` |
| **Main Layout** | `src/frontend/src/components/Layout.tsx` |
| **Routing** | `src/frontend/src/lib/router.tsx` |
| **Theme System** | `src/frontend/src/contexts/ThemeContext.tsx` |
| **Image Settings Hook** | `src/frontend/src/hooks/useImageSettings.ts` |
| **Site Settings Hook** | `src/frontend/src/hooks/useSiteSettings.ts` |
| **Backend API** | `src/backend/main.mo` |
| **Admin Panel** | `src/frontend/src/components/pages/AdminPage.tsx` |

```bash
# Install dependencies
pnpm install

# Start development
cd src/frontend && pnpm dev

# Build for production
cd src/frontend && pnpm build

# Deploy to ICP
dfx deploy --network ic
```

---

## Table of Contents

1. [Quick Reference](#-quick-reference-for-designers--developers)
2. [Project Structure](#1-project-structure)
3. [Common Updates Guide](#2-common-updates-guide)
4. [Local Development Setup](#3-local-development-setup)
5. [Building and Deploying to ICP](#4-building-and-deploying-to-icp)
6. [Custom Domain Setup (GoDaddy, Cloudflare, Namecheap)](#5-custom-domain-setup)
7. [Admin Panel Usage](#6-admin-panel-usage)
8. [Third-Party Website Editor Integration](#7-third-party-website-editor-integration)
9. [AI / LLM Integration (ChatGPT, Claude, Grok, Local LLM)](#8-ai--llm-integration)
10. [Blog Automation and Webhooks](#9-blog-automation-and-webhooks)
11. [GitHub Export and Handoff](#10-github-export-and-handoff)
12. [Security Notes](#11-security-notes)
13. [Environment Configuration Reference](#12-environment-configuration-reference)

---

## 1. Project Structure

```
/
├── src/
│   ├── backend/           # Motoko backend canister (ICP)
│   │   └── main.mo        # All backend API endpoints
│   └── frontend/          # React + TypeScript + Tailwind frontend
│       ├── public/
│       │   └── assets/    # Images, logo, headshots
│       ├── src/
│       │   ├── App.tsx                    # Route definitions
│       │   ├── backend.d.ts               # Auto-generated backend type bindings
│       │   ├── components/
│       │   │   ├── Layout.tsx             # Header, footer, nav
│       │   │   └── pages/
│       │   │       ├── admin/             # Admin panel tabs
│       │   │       ├── HomePage.tsx
│       │   │       ├── AboutPage.tsx
│       │   │       ├── LegalPage.tsx      # Privacy Policy, Terms, Cookie Policy
│       │   │       ├── PartnersPage.tsx
│       │   │       ├── WizardPage.tsx     # Intake wizard
│       │   │       └── ...
│       │   └── hooks/
│       │       ├── useSiteSettings.ts     # Site-wide text/color settings
│       │       └── useImageSettings.ts    # Image crop/zoom settings
│       └── env.json                       # Canister IDs (fill in after deploy)
├── dfx.json               # ICP deployment configuration
├── package.json
└── README.md              # This file
```

---


## 2. Common Updates Guide

### Updating the Logo
1. Replace `src/frontend/public/assets/cybin-logo.png` with your new logo
2. The logo automatically adapts: white background on light mode, black on dark mode
3. Clear browser cache to see changes

### Updating Site Colors
- **Primary colors**: `src/frontend/src/lib/theme/tokens.ts` - Look for `color` and `accent` tokens
- **Tailwind config**: `src/frontend/tailwind.config.js`
- **Theme context**: `src/frontend/src/contexts/ThemeContext.tsx`

### Updating Page Content
Each page is a separate component in `src/frontend/src/components/pages/`:
- HomePage.tsx - Landing page
- AboutPage.tsx - About us
- IndustriesPage.tsx - Industries we serve
- PartnersPage.tsx - Partner program
- BlogPostPage.tsx - Individual blog posts

### Adding a New Page
1. Create component in `src/frontend/src/components/pages/`
2. Add route in `src/frontend/src/lib/router.tsx`
3. Add navigation link in `src/frontend/src/components/Layout.tsx`

### Updating Blog Posts
Edit `src/frontend/src/data/blogPosts.ts` - Each post is an object with title, content, date, etc.

### Updating Industries Data
Edit `src/frontend/src/data/industries.ts` - Contains all industry-specific content and images.

### Image Optimization
- Source images go in `src/frontend/public/assets/uploads/`
- Generated/optimized images in `src/frontend/public/assets/generated/`
- Run `node scripts/resize-images.js` to optimize images
- Run `node scripts/prune-unused-images.js` to remove unused images

## 3. Local Development Setup

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- DFX CLI (`sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`)

### Steps

```bash
# Install all dependencies
pnpm install

# Start local ICP replica
dfx start --background

# Deploy canisters locally
dfx deploy

# Start frontend dev server
cd src/frontend
pnpm dev
```

The site will be available at `http://localhost:5173`.

---

## 4. Building and Deploying to ICP

### Deploy to ICP Mainnet

```bash
# Make sure you have a cycles wallet funded with ICP
dfx identity get-principal

# Deploy to mainnet
dfx deploy --network ic

# Your canister IDs will be printed. Save them.
# Update src/frontend/env.json with these values.
```

### Update env.json

After deploying, fill in `src/frontend/env.json`:

```json
{
  "backend_canister_id": "your-backend-canister-id",
  "frontend_canister_id": "your-frontend-canister-id",
  "backend_host": "https://icp0.io",
  "project_id": "your-project-id",
  "ii_derivation_origin": "https://your-canister-id.icp0.io"
}
```

---

## 5. Custom Domain Setup

To point `cybinenterprises.com` (or any custom domain) to your ICP-hosted site:

### Step 1 — Get your canister IDs

From the Caffeine project dashboard → Project Settings, or from `dfx deploy` output.

### Step 2 — Add DNS records

In your DNS provider (GoDaddy, Cloudflare, Namecheap):

| Type  | Name              | Value                                  | TTL  |
|-------|-------------------|----------------------------------------|------|
| CNAME | www               | `<frontend-canister-id>.icp0.io`       | Auto |
| CNAME | @                 | `<frontend-canister-id>.icp0.io`       | Auto |
| CNAME | _canister-id      | `<frontend-canister-id>`               | Auto |
| TXT   | _canister-id      | `<frontend-canister-id>`               | Auto |

> **GoDaddy Note:** GoDaddy does not allow CNAME on the root `@`. Use `www` as the primary domain, or use Cloudflare as a proxy (recommended for root domain support).

> **Cloudflare Note:** Set the CNAME proxy status to "DNS only" (grey cloud, not orange) for ICP domains.

### Step 3 — Register domain in Caffeine / ICP

In the Caffeine dashboard → Settings → Custom Domain, add `cybinenterprises.com` and `www.cybinenterprises.com`.

This creates the `.well-known/ic-domains` verification file automatically.

### Step 4 — Verify

DNS propagation typically takes 5–30 minutes. Check with:

```bash
dig CNAME www.cybinenterprises.com
nslookup www.cybinenterprises.com
```

---

## 6. Admin Panel Usage

Access the admin panel at: `https://[your-site-url]/admin`

**Default PIN:** `cybin2026`

> Change the PIN by editing `AdminPage.tsx` and updating the `ADMIN_PIN` constant, then redeploying.

### Admin Tabs

| Tab | Description |
|-----|-------------|
| Image Editor | Drag-and-drop crop positioning, zoom, alignment grid for Mel, Shane, and logo |
| Site Editor | Edit all text (hero, bios, contact info), adjust colors, Export & Integrations guide |
| Blog Manager | Create, edit, publish, and delete blog posts. Includes AI/webhook integration docs |
| Analytics | Privacy-first page view analytics stored locally |
| Partner Leads | View all partner application submissions |
| Applications | View all wizard intake form submissions |
| Contact | View all contact form submissions |

### Real-Time Editing

All changes in the Site Editor and Image Editor apply **instantly** to the live site without a page reload. Changes are saved to browser `localStorage` and broadcast via `CustomEvent`. To make changes permanent across all browsers, export them and apply them as code-level defaults.

---

## 7. Third-Party Website Editor Integration

### Option A — Iframe Embed

Embed the live site in any platform that supports iframes (Notion pages, Webflow containers, internal dashboards):

```html
<iframe
  src="https://cybinenterprises.com"
  width="100%"
  height="100%"
  frameborder="0"
  allow="fullscreen"
></iframe>
```

### Option B — Headless Rebuild in Webflow / Framer

1. Export the project via GitHub (see Section 9)
2. Open `src/frontend/index.css` — extract the design system variables (colors, fonts, spacing)
3. Open `src/frontend/tailwind.config.js` — extract the color tokens
4. Recreate the visual layer in Webflow or Framer using these exact tokens
5. For dynamic data (blog posts, contact form, wizard submissions), connect Webflow to the ICP backend API using Webflow's custom code embed + fetch API calls
6. Reference `src/frontend/src/backend.d.ts` for the exact API method signatures

### Option C — Visual Site Builder with Live Edit (Admin Panel)

The admin panel's **Site Editor** tab (`/admin` → Site Editor) provides a visual interface to edit all site copy, images, and colors without touching code. This is the recommended approach for non-technical content updates.

---

## 8. AI / LLM Integration

This site is built to receive AI-generated content through backend webhooks. API keys must never be stored in the frontend.

### Option A — Public AI APIs (ChatGPT, Claude, Grok, Gemini)

#### OpenAI (ChatGPT)

```javascript
// Server-side only (Node.js, Deno, or ICP HTTP outcall)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a payment industry expert writing for Cybin Enterprises.' },
      { role: 'user', content: 'Write a 600-word blog post about preventing chargebacks.' }
    ],
  }),
});
const data = await response.json();
const blogContent = data.choices[0].message.content;
// Then POST to the Cybin backend createBlogPost endpoint
```

#### Anthropic (Claude)

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Write a blog post about high-risk merchant accounts.' }],
  }),
});
```

#### xAI (Grok)

```javascript
const response = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'grok-3',
    messages: [{ role: 'user', content: 'Write about payment processing trends in 2026.' }],
  }),
});
```

### Option B — Locally Hosted LLM (Ollama)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3
ollama pull mistral

# Ollama runs a REST API at http://localhost:11434
```

```javascript
// Call local Ollama
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3',
    prompt: 'Write a blog post about high-risk payment processing.',
    stream: false,
  }),
});
const data = await response.json();
const blogContent = data.response;
```

For production, deploy Ollama to a VPS (Hetzner, DigitalOcean, Vultr) and call it via ICP HTTP outcalls from the backend canister.

### Option C — ICP HTTP Outcalls (Recommended for Production)

The most secure approach: call AI APIs directly from the ICP backend canister using HTTP outcalls (no external server required).

```motoko
// In src/backend/main.mo
import HttpTypes "mo:base/HttpTypes";

public func generateBlogPost(prompt: Text) : async Text {
  let request : HttpTypes.HttpRequest = {
    url = "https://api.openai.com/v1/chat/completions";
    method = "POST";
    body = Text.encodeUtf8("{ \"model\": \"gpt-4o\", ... }");
    headers = [
      ("Authorization", "Bearer " # OPENAI_API_KEY),
      ("Content-Type", "application/json")
    ];
    transform = null;
  };
  // See ICP documentation: https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/https-outcalls/
};
```

---

## 9. Blog Automation and Webhooks

### Zapier / Make Integration

1. Go to [zapier.com](https://zapier.com) or [make.com](https://make.com)
2. Create a new Zap/Scenario
3. Set a trigger (e.g., "New row in Google Sheets", "Scheduled time", "RSS feed item")
4. Add an action: **Webhooks** → **POST** to `https://cybinenterprises.com/api/blog`
5. Map the fields:

```json
{
  "title": "Your blog post title",
  "category": "Payment Infrastructure",
  "excerpt": "Short description...",
  "body": "Full article body...",
  "author": "Cybin Enterprises",
  "readTime": "5 min read",
  "publishDate": "2026-03-07"
}
```

> **Note:** The `/api/blog` webhook endpoint requires developer activation. Contact your dev team to enable and secure this endpoint with an API key.

### n8n (Self-Hosted Automation)

[n8n](https://n8n.io) is an open-source alternative to Zapier that you can self-host:

```bash
npx n8n
# or
docker run -it --rm -p 5678:5678 n8nio/n8n
```

Use the HTTP Request node in n8n to POST to the blog webhook.

---

## 10. GitHub Export and Handoff

### Via Caffeine Dashboard

1. Go to your Caffeine project dashboard
2. Settings → GitHub Export
3. Authorize the Caffeine GitHub app
4. Select or create a private repository
5. Click "Push to GitHub"

### Cloning and Running Locally

```bash
git clone https://github.com/yourorg/cybin-enterprises
cd cybin-enterprises
pnpm install
cd src/frontend
pnpm dev
```

### Deploying from GitHub

```bash
# From project root
dfx deploy --network ic

# Or build frontend only
cd src/frontend
pnpm build
# Output: src/frontend/dist/
```

---

## 11. Security Notes

| Topic | Guidance |
|-------|----------|
| Admin PIN | Change `ADMIN_PIN` in `AdminPage.tsx` before going to production. Consider adding IP allowlisting. |
| API Keys | Never store AI API keys in frontend code. Use ICP canister state or server-side environment variables. |
| Canister IDs | Canister IDs are public by design on ICP but should not be embedded in third-party editor environments. |
| CORS | The ICP backend canister enforces its own CORS policy. Third-party tools calling the API must be allowlisted. |
| Input Validation | All form fields have `maxLength` attributes. Backend validates all inputs before storing. |
| Rate Limiting | Consider adding rate limiting to the backend if you expose public API endpoints. |
| PCI-DSS | This site does not process cardholder data. Ensure any payment processing integration uses PCI-DSS Level 1 validated processors only. |

---

## 12. Environment Configuration Reference

### src/frontend/env.json

| Key | Description | Where to Find |
|-----|-------------|---------------|
| `backend_canister_id` | ICP canister ID of the backend | `dfx canister id backend --network ic` |
| `frontend_canister_id` | ICP canister ID of the frontend | `dfx canister id frontend --network ic` |
| `backend_host` | ICP API host | Always `https://icp0.io` for mainnet |
| `project_id` | Caffeine project ID | Caffeine dashboard → Project Settings |
| `ii_derivation_origin` | Internet Identity origin for auth | `https://<frontend-canister-id>.icp0.io` |

---

## Support

- **Caffeine Platform:** [caffeine.ai](https://caffeine.ai)
- **ICP Developer Docs:** [internetcomputer.org/docs](https://internetcomputer.org/docs)
- **Cybin Enterprises Contact:** Customercare@cybinenterprises.com | 888-321-2100
