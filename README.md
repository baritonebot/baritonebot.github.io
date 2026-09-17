# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploy to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`, which builds the site as
static files and publishes them to GitHub Pages on every push to `main`.

One-time setup:

1. Push this project to the GitHub account that owns `username.github.io`.
   - To serve the site at `https://<username>.github.io/` exactly, name the
     repository `<username>.github.io`.
   - Any other repository name works too; the site then lives at
     `https://<username>.github.io/<repository>/`.
2. In the repository, go to **Settings > Pages** and set **Source** to
   **GitHub Actions**.
3. Go to **Settings > Secrets and variables > Actions > Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

   (Copy the values from your local `.env`. They are public publishable keys,
   safe to ship in a frontend.)
4. Push to `main` — the workflow builds `.output/public` and deploys it.

The build outputs static HTML only. Client-side routes like `/admin` and
`/auth` are served through the `404.html` fallback the workflow creates.
After deploy, update `SITE_URL` in `src/lib/site.ts` (and the URLs in
`public/robots.txt` / `public/sitemap.xml`) to your final address.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
