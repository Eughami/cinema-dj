# Mantine Vite template

Get started with the template by clicking `Use this template` button on the top of the page.

[Documentation](https://mantine.dev/guides/vite/)

## Local configuration

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL`: backend base URL

## Admin access

- Open `/admin/login` and sign in with backend admin credentials.
- The JWT is stored in browser localStorage and sent as bearer token for `/admin/*` API calls.
