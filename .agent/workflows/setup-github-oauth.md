---
description: How to set up GitHub OAuth for the blog admin
---

# GitHub OAuth App Setup Guide

To enable the Admin panel (Decap CMS) with GitHub login, you need to create an OAuth App.

## 1. Create OAuth App
1. Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
2. Click **"New OAuth App"**.

## 2. Fill in Details
- **Application Name**: `Develop Blog (Local)` (or any name you like)
- **Homepage URL**: `http://localhost:7000`
- **Authorization callback URL**: `http://localhost:7000/api/auth/callback`

> **Note**: For production, create a separate app or add the production URL.
> - Homepage: `https://your-cloud-run-url.run.app`
> - Callback: `https://your-cloud-run-url.run.app/api/auth/callback`

## 3. Get Credentials
1. Click **"Register application"**.
2. Copy the **Client ID**.
3. Click **"Generate a new client secret"** and copy the **Client Secret**.

## 4. Configure Environment Variables
Add these to your `.env` or `.env.local` file:

```bash
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

## 5. Restart Server
Restart your Next.js server to load the new environment variables.
```bash
npm run dev
```
