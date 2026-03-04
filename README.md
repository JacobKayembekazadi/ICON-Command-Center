<div align="center">

<h1>⚡ ICON Command Center</h1>
<p><strong>Live Shopify intelligence dashboard with AI-generated insights.</strong></p>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-black?style=for-the-badge)](https://icon-command-center.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://icon-command-center.vercel.app)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)

</div>

---

## Overview

A real-time operations dashboard that connects directly to Shopify's API and surfaces AI-generated insights — revenue trends, top products, order velocity, and strategic recommendations — in a single dark luxury interface.

Built as a concept for a $30M DTC menswear brand.

---

## Features

- 📊 **Live Shopify data** — orders, revenue, products, customers via Shopify API
- 🤖 **AI Intelligence panel** — Gemini-powered insights updated on every load
- 📈 **Interactive charts** — revenue trends, category breakdown, order velocity
- ⚡ **5-minute data cache** — instant tab switching, no redundant API calls
- 📱 **PWA + mobile** — installable, bottom nav, safe area insets
- 🔒 **Server-side AI** — Gemini key never exposed to client bundle

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, custom dark luxury design system |
| Charts | Recharts v3 |
| AI | Google Gemini via serverless proxy |
| Data | Shopify Admin REST API |
| Deploy | Vercel (Edge Functions for AI proxy) |

---

## Architecture

```
Client (React SPA)
  └── /api/ai.ts  ← Vercel serverless (Gemini key lives here only)
  └── Shopify API ← direct from client with public token
```

---

## Local setup

```bash
git clone https://github.com/JacobKayembekazadi/ICON-Command-Center
cd ICON-Command-Center
npm install

# Add to .env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_token
GOOGLE_API_KEY=your_gemini_key

npm run dev
```

---

<div align="center">
<sub>Built by <a href="https://sloelabs.com">Sloe Labs</a> · Concept build</sub>
</div>