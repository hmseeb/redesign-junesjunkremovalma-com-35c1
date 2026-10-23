# Junes Junk Removal — New Bedford, MA

Static marketing website for **Junes Junk Removal**, a locally owned junk removal and
cleanout company based in New Bedford, Massachusetts, serving 42+ communities across
Southeastern Massachusetts and Rhode Island.

- Phone / text: **774-400-8888**
- Email: junesjunkremoval@yahoo.com
- 45 Eastland Terrace, New Bedford, MA 02740 — Open 7 days, 7AM–9PM — English & Português

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies — `index.html` is the
entry point and every page is a plain static file that can be served from any host.

```
index.html                     Home (hero, services, pricing, FAQ, contact)
404.html                       Not-found page
about/                         About the company
services/                      Services index + 19 individual service pages
service-areas/                 Service areas index (5 regions, 42+ towns)
service-area/<town>/           Town pages: new-bedford, acushnet, barnstable
assets/css/styles.css          Design system (brand blue + signal yellow)
assets/js/main.js              Nav drawer, mega menu, scroll reveal, form handling
images/source/                 Photography from the business
favicon.svg, robots.txt, site.webmanifest
```

## Forms

Every form posts to the LeadrVision endpoint:

```
POST https://vision.leadrai.com/api/forms/eedf28d94944ec3ff7a2bc74ecfa84b1
```

Each form carries a hidden `_form` name, a `_page` field (pre-filled with the page path
and upgraded to the full URL by JavaScript on load), and a `_gotcha` honeypot. Forms work
without JavaScript via a normal POST — the visitor returns with `?submitted=1` and a
confirmation is shown. With JavaScript the same data is sent via `fetch()` as JSON and the
confirmation is shown inline.

## Notes

- All internal links are root-relative.
- `/review` is provided by the hosting platform and is linked from the footer, the mobile
  menu, the testimonials block and the contact section.
