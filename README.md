# My Portfolio

A dynamic, self-managed portfolio built with React (Vite) and Decap CMS. Content is stored as Markdown/JSON files in this repo and edited through a free admin dashboard — no database, no backend server.

## Stack

- **Frontend:** React + Vite
- **Routing:** React Router DOM
- **Content management:** Decap CMS (Git-based, free)
- **Hosting:** Netlify (free tier)
- **Auth for CMS:** GitHub OAuth via Netlify Identity / Git Gateway
- **Contact form:** Formspree

## Project structure

my-portfolio/

├── public/

│   ├── images/              # uploaded media (covers, photos, project images)

│   └── admin/

│       ├── index.html       # Decap CMS entry point

│       └── config.yml       # CMS collections & fields config

├── content/

│   ├── hero/index.md         # Hero section (single type)

│   ├── experience/.md       # Experience entries (collection)

│   ├── projects/.md         # Project entries (collection)

│   ├── ebooks/.md           # Ebook metadata (collection)

│   ├── ebooks/html/.html    # Raw ebook HTML content

│   └── cv/index.md           # CV (single type, structured fields)

├── src/

│   ├── lib/

│   │   └── content.js        # Loads & parses content files

│   ├── components/

│   │   ├── Hero.jsx

│   │   ├── Experience.jsx

│   │   ├── Projects.jsx          # Homepage section (preview, links to /projectPage)

│   │   ├── projectPage.jsx       # Full projects page with sidebar nav + viewer

│   │   ├── Ebooks.jsx            # Homepage section (preview, links to /EbooksPage)

│   │   ├── EbooksPage.jsx        # Full ebooks page with sidebar nav + viewer

│   │   ├── Blogs.jsx

│   │   ├── AdvertiseBlogs.jsx

│   │   ├── Testimonials.jsx

│   │   ├── Navbar.jsx

│   │   ├── Cv.jsx

│   │   └── Contact.jsx

│   ├── App.jsx

│   └── main.jsx

├── index.html

├── package.json

└── vite.config.js

## Routes

| Path           | Component       | Description                        |
|----------------|-----------------|------------------------------------|
| `/`            | App (main)      | Homepage with all sections         |
| `/projectPage` | projectPage.jsx | Full projects browser              |
| `/EbooksPage`  | EbooksPage.jsx  | Full ebooks browser                |
| `/Blogs`       | Blogs.jsx       | Blog articles page                 |
| `/cv`          | Cv.jsx          | CV page                            |

## Sections overview

| Section      | Type                        | Add | Edit | Delete |
|--------------|-----------------------------|-----|------|--------|
| Hero         | Single type                 | –   | ✅   | –      |
| Experience   | Collection                  | ✅  | ✅   | ✅     |
| Projects     | Collection                  | ✅  | ✅   | ✅     |
| Ebooks       | Collection (+ HTML content) | ✅  | ✅   | ✅     |
| CV           | Single type (structured)    | ✅ within groups | ✅ | ✅ within groups |
| Contact      | Static form (Formspree)     | –   | –    | –      |

## Component design notes

### Projects & Ebooks (homepage sections)
Both `Projects.jsx` and `Ebooks.jsx` are homepage preview sections. They show a featured card (smaller, with cover image) on the left and a scrollable thumbnail list on the right. Each featured card has two buttons: one to view the item directly, and a **Browse All** button linking to the dedicated full page.

### projectPage & EbooksPage (full pages)
Both full pages share the same layout: a sticky sidebar nav on the left listing all items, and a detail viewer on the right. Clicking a sidebar item animates the viewer to show the full details — cover, description, tags, and a CTA button.

### Contact section
The contact form sits directly on the gradient background (no white card). Input fields use a frosted/translucent white style with white text and white borders to stay visible on the gradient.

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Editing content

### Locally (manual)
Edit Markdown files under `content/` directly, then commit/push.

### Via the CMS dashboard (recommended for non-developers)
1. Go to `yoursite.netlify.app/admin`
2. Log in with GitHub
3. Add, edit, or delete entries in any section
4. Click **Publish** — this commits the change to GitHub
5. Netlify rebuilds and redeploys automatically (~1 min)

No Git or coding knowledge required for the dashboard.

## Deployment

1. Push this repo to GitHub.
2. Create a new Netlify site from the repo.
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Enable **Identity** and **Git Gateway** in Netlify site settings (required for CMS login).
4. Visit `/admin` on the deployed site and log in with GitHub.

## Ebooks: protection note

Ebook HTML content is stored and managed via the CMS like any other asset. Anti-copy/download protections (disabled right-click, disabled selection, blocked copy events) are implemented in the frontend viewer component, not in the CMS. These are deterrents only, not full DRM.

## CV: structured content

The CV is not a static PDF. It's structured data (name, title, summary, repeatable experience/education/skills entries) edited through the CMS and rendered into a CV page by the frontend. A downloadable PDF can be generated from this same data at build time.

## Roadmap / next steps

- [x] Routing with React Router DOM
- [x] Projects full page (`/projectPage`)
- [x] Ebooks full page (`/EbooksPage`)
- [x] Homepage preview sections with Browse All buttons
- [x] Contact form styled directly on gradient background
- [ ] Ebook protected viewer component
- [ ] CV PDF generation at build time
- [ ] Contact form integration (Formspree/Resend)
- [ ] OAuth setup for Decap CMS login