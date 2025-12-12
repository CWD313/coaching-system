Client (Next.js) scaffold

Run:
1. cd client
2. npm install
3. npm run dev

Note: The client currently assumes a reverse proxy so that `/api` proxies to the backend. For local dev, configure Next.js rewrites or run backend on a different port and set `NEXT_PUBLIC_API` env var and use absolute URLs.
