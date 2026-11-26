# Putting the site online (about $10–11 per year)

| What | Where | Cost |
|---|---|---|
| Hosting | Cloudflare Pages | Free (unlimited bandwidth, free HTTPS) |
| Domain name | Cloudflare Registrar | At cost with no markup; a `.com` is roughly $10–11/year |

You need to do the account sign-up and payment steps yourself.

## 1. Push the code to GitHub
The code is already in `github.com/AmyMSutherland/portfolioWebsite`. Merge the `new-site` branch
into `main` and push. The repository can stay private.

## 2. Create the free Cloudflare Pages site
1. Sign up at https://dash.cloudflare.com/sign-up (free plan).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**, authorize GitHub, and pick `portfolioWebsite`.
3. Build settings:
   - Framework preset: **Eleventy** (or "None")
   - Build command: `npx @11ty/eleventy`
   - Build output directory: `_site`
   - Production branch: `main`
4. **Save and Deploy.** Your site goes live at `https://<project-name>.pages.dev`.
   Every push to `main` rebuilds it.

## 3. Register your domain
1. In the Cloudflare dashboard, open **Domain Registration → Register Domains**.
2. Search for a name (e.g. `amysutherland.com`, `amysutherland.art`, `amysutherlandphoto.com`).
   Compare the yearly **renewal** price, not just the first year. `.com` is usually cheapest to keep.
3. Buy it. WHOIS privacy (hiding your home address) is included free.

## 4. Connect the domain to the site
1. In **Workers & Pages → your project → Custom domains → Set up a custom domain**, enter
   `yourdomain.com`, then add `www.yourdomain.com` too.
2. Because the domain is on Cloudflare, the DNS records are created for you. HTTPS is ready within minutes.
3. Optional: under **Rules → Redirect Rules**, redirect `www` to the bare domain (or the other way round).

## Optional extras
- **Email at your domain**: Cloudflare Email Routing (free) forwards `hello@yourdomain.com`
  to your personal inbox. Then put that address in `src/_data/site.js`.
- **Visitor stats without cookies**: Cloudflare Web Analytics (free), turned on in the Pages project settings.

## Cheaper or different options
- **GitHub Pages** is also free, but the repo must be public on a free GitHub account and you have to set up
  a build workflow for Eleventy. Cloudflare Pages is simpler here.
- **Porkbun** is another low-cost registrar if you'd rather keep the domain separate from hosting.
