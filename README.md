# Abdul Wahab — Professional Web Developer Portfolio

A responsive, static personal portfolio built with semantic HTML, CSS and vanilla JavaScript. This is an upgrade of the supplied portfolio project, with the original portrait retained and optimized for the page.

## Run locally on Windows

1. Extract the ZIP file.
2. Open PowerShell and change to the extracted project folder. For example:

```powershell
cd path\to\abdul-wahab-portfolio
```

3. Start the local web server:

```powershell
py -m http.server 5500
```

4. Open **http://localhost:5500** in your browser.
5. Press `Ctrl+C` in PowerShell to stop the server.

For a typical Downloads folder, the commands are:

```powershell
Set-Location "$env:USERPROFILE\Downloads\abdul-wahab-portfolio"
py -m http.server 5500
```

Run the server from the folder that contains `index.html`.

## Project structure

```text
abdul-wahab-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── abdul-wahab-original.png
    ├── abdul-wahab-portrait.webp
    └── favicon.svg
```

## Features

- Responsive desktop, tablet and mobile layouts.
- Dark and light themes with a system-preference default and saved selection in `localStorage`.
- Accessible desktop and mobile navigation, active-section tracking and project filters.
- Scroll-triggered reveal transitions, staggered card movement, floating hero accents, hover states and subtle animated backgrounds.
- Reduced-motion support for visitors who prefer less animation.
- SEO title, description, author, Open Graph and Twitter metadata.
- Optimized WebP portrait used on the page; original PNG is retained in `assets/`.
- No JavaScript frameworks, icon packages or other runtime dependencies.

## Portfolio projects

The portfolio presents all six projects supplied for this handover:

1. **KiaanCafe.com** — Live café website. The public website currently exposes menu/category browsing, a cart, online-order entry points, café information and contact/location information. Its precise implementation stack is not claimed because it was not verifiable from the public-facing site.
2. **Custom Accounting Dashboard** — Public Odoo 17 Community repository. The repository README describes an OWL 2 dashboard, Python-backed accounting aggregation and Chart.js visualizations for accounting records and summaries. The README does not claim that the module has been installed in a live production database.
3. **Farm Chicken Management** — Public Odoo 18 module. Its manifest documents batch inventory, vaccine scheduling, feed, egg production, mortality, sales, incubator/hatching workflows, baby-chicken management, expenses and dashboard assets.
4. **XenSMS** — Private SMS gateway and Odoo 17 integration development project.
5. **Corporate Real Estate Management** — Private Odoo 18 real-estate management development project.
6. **Dental Medic** — Private clinic website customization project.

The non-live project preview panels are illustrative interface artwork, not screenshots of working applications. Private projects are not represented as publicly deployed products. Project wording avoids invented live deployment claims and fake performance or usage statistics.

## Contact form behaviour

This is a static website and has no server-side form processor. The form validates the supplied fields and prepares an email draft addressed to `abdul404wahab@gmail.com`. The visitor then chooses **Open prepared email** to open their configured email application. The site does not claim to send, store or track form submissions. A backend or form provider would be needed for server-side delivery.

The WhatsApp link opens a chat with the supplied number `01780843475` using the international `wa.me` format.

## Theme behaviour

- First visit: follows the operating system's light/dark preference.
- Manual selection: saved under `aw-portfolio-theme` in browser `localStorage`.
- Later visits: restores the saved selection.
- When no saved choice exists, the page can follow later system theme changes.

## Before publishing to a hosting provider

- Upload the contents of this folder so `index.html` is at the site root.
- Confirm the live domain and configure a canonical URL if desired; one is intentionally not invented here.
- Configure a server-side form endpoint only if direct form submission is required.
- Test the deployed site over HTTPS and verify social-profile URLs from the deployment environment.
