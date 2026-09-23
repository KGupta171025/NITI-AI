# NITI AI

A self‑hosted multilingual AI platform to help Indian entrepreneurs discover relevant government schemes.

## Overview
- **Frontend**: Next.js (React) with TypeScript, Tailwind CSS, Liquid Glass UI.
- **Backend**: Cloudflare Workers (API gateway) written in TypeScript.
- **Auth**: Firebase Authentication (Google & Apple Sign‑In).
- **Data**: Cloudflare D1 (relational), KV / R2 for documents.
- **AI**: Local LLM inference, embeddings, RAG pipeline.
- **DevOps**: pnpm monorepo, GitHub Actions CI/CD, Wrangler for Cloudflare deployment.

## Getting Started
```bash
# Clone the repo
git clone https://github.com/<your‑username>/NITI-AI.git
cd NITI-AI

# Install pnpm (if not installed)
npm i -g pnpm

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Fill in the required values (Firebase config, Cloudflare account, etc.)

# Run the development servers
pnpm dev
```

## License
MIT © 2026
