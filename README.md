# Marouane Daoudi — academic website

Personal academic website of **Marouane Daoudi**, M2 Statistique et science des données, Université de Montpellier. English is the default language; the complete French version is under `/fr/`.

Production: <https://marouanedaoudi.github.io/> · Source: <https://github.com/marouanedaoudi/marouanedaoudi.github.io>

## Preview on this Windows PC

The project lives at `C:\Users\Marouane Daoudi\Documents\personal-website`. Hugo Extended **0.143.0** is pinned to the deployment version. A portable installation is kept in `.tools/hugo/` when installed locally; it is intentionally ignored by Git.

```powershell
Set-Location -LiteralPath 'C:\Users\Marouane Daoudi\Documents\personal-website'
& '.\.tools\hugo\hugo.exe' server --bind 127.0.0.1 --port 1313 --disableFastRender
```

Open <http://localhost:1313/> and <http://localhost:1313/fr/>. Edits to Markdown and templates refresh automatically. Stop the server with `Ctrl+C`.

If Hugo is on PATH, use `hugo server --disableFastRender` instead. To recover on another PC, install Git and Hugo Extended 0.143.0, then:

```powershell
git clone --recurse-submodules https://github.com/marouanedaoudi/marouanedaoudi.github.io.git personal-website
Set-Location personal-website
hugo server --disableFastRender
```

The pinned Blowfish submodule is retained for compatibility with historical content; the academic page templates, styles and scripts are maintained locally in this repository. No Node package installation, npm build, or Sass installation is needed. Node.js 22 or newer is used only by the dependency-free validation script.

## Content and design

| Location | Purpose |
| --- | --- |
| `content/_index.en.md`, `content/_index.fr.md` | Profile, current degree and research direction |
| `content/projets/<project>/index.en.md` and `.fr.md` | Selected project pages; preserve existing URLs |
| `content/notes/` | Mathematical notes in both languages |
| `content/cv/` | Bilingual academic CV pages |
| `content/contact/` | Contact details and research internship objective |
| `static/uploads/` | Downloadable reports and CV PDFs |
| `layouts/` | Page templates, navigation, metadata, structured data and search |
| `assets/css/`, `assets/js/`, `static/fonts/` | Local visual and interaction assets |
| `hugo.toml` | Languages, navigation, site identity and production URL |

For a new project, duplicate an existing bilingual page bundle, set an accurate `title`, `description`, `summary`, `date` and `weight`, and put its images in the same folder. Use the same filename stem in both languages so Hugo links translations correctly. Add `draft: true` until the content is ready. Do not label student projects as publications. Set `noindex: true` for a temporary page that should stay out of search and the sitemap.

## Build and verify

```powershell
& '.\.tools\hugo\hugo.exe' --gc --minify --cleanDestinationDir
node scripts/validate-site.mjs public
```

The validator checks internal links and anchors, image references and alternate language reciprocity; it also checks titles, descriptions, canonical URLs, one H1 per page, valid JSON-LD, noindex exclusions, sitemap coverage, social preview dimensions, local search JSON and the preserved Google ownership verification file. The check runs in GitHub Actions for every pull request and production build.

`public/`, generated resources and local tools are ignored. Never edit `public/`: Hugo regenerates it. Always edit the source, build again, and review both desktop and mobile pages.

## Publish

GitHub Pages must use **GitHub Actions** in the repository's Settings → Pages. A successful push to `main` builds, validates and deploys the site. Pull requests build and validate without publishing. The existing address and Google ownership verification file are preserved.

```powershell
git status
git add -A
git commit -m "Update academic website"
git push origin main
```

Review the changes before committing. For a redesign branch, merge it into `main` only after reviewing the preview. The Actions tab reports build and deployment errors.

## Search visibility

The site provides distinct English/French titles and descriptions, absolute canonical and reciprocal language links, an XML sitemap, crawlable mathematical content, `Person` and `ProfilePage` structured data, breadcrumbs, and social preview images. Tags and categories are deliberately `noindex` to avoid thin duplicate search results. The verification file `static/google27cb935313f9e2a6.html` remains intact.

After deployment, the site owner can use [Google Search Console](https://search.google.com/search-console/) to inspect the home page and submit `https://marouanedaoudi.github.io/sitemap.xml`. Add the website to authentic university, GitHub and professional profiles, and keep the same name and URL across them. No keyword stuffing or invented publications are used.

Google controls whether and when pages are indexed and how they rank. Technical optimization supports discovery but cannot guarantee an immediate first-place result for a name query. See Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Convenient Windows commands

The portable Hugo executable is already installed on this PC. From the project folder:

    .\scripts\preview.ps1

Use .\scripts\build.ps1 for a production build and local validation. On another Windows PC, .\scripts\setup.ps1 downloads the official pinned Hugo release, verifies its SHA256 checksum, and restores the theme. Git is required; no global Hugo installation is needed.

The CV source is scripts/build_cv.py; it requires Python and ReportLab. It uses standard PDF Times/Helvetica fonts, so no extra font installation is needed. Run it from the project folder after changing the factual CV data, then visually review both PDFs. HTML CV pages and PDF CVs must be updated together.
