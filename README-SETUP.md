# Lake Norman HVAC — site setup & handoff

A five-page static website. No build step, no dependencies, no framework.
Open `index.html` in a browser and it works.

```
index.html        Home (hero video, services, before/after slider, plan, reviews)
services.html     All six services + maintenance plan + FAQ
about.html        Story, values, credentials, owner's note
gallery.html      Two before/after sliders + mini-split gallery
contact.html      Contact details + estimate form + pre-call troubleshooting
assets/css/site.css   All styling (design tokens at the top)
assets/js/site.js     Nav, before/after slider, reveals, form handling
media/                Your photos, logo, and hero video
```

---

## 1. Before you launch — replace the placeholders

Everything you need to change is wrapped in `[SQUARE BRACKETS]`, plus the phone
number and email. Do a find-and-replace **across all five `.html` files**.

### Phone number — do this first

| Find | Replace with | Count |
|---|---|---|
| `(704) 555-0100` | your number, same format | 28 |
| `+17045550100` | `+1` + 10 digits, no spaces or dashes | 34 |

The first is what people *see*; the second is what the `tel:` links *dial*.
Both must change or the buttons will call the wrong number. `555-0100` is a
reserved fictional number, so nothing here dials a real person right now.

### Email

| Find | Replace with | Count |
|---|---|---|
| `service@lakenormanhvac.com` | your real address | 12 |

### Bracket tokens

| Token | What it is | Count |
|---|---|---|
| `[LICENSE NUMBER]` | NC contractor license number | 7 |
| `[STREET ADDRESS]` | street line; city/state/zip already say Cornelius, NC 28031 | 6 |
| `[YEAR]` | year founded | 2 |
| `[OWNER NAME]` | owner's name, in the About story and signature | 2 |
| `[MANUFACTURER]` | e.g. Trane, Lennox, Carrier — whoever you're a dealer for | 1 |
| `[XX]` | years in business, team size, plan price, repair discount % | 10 |
| `[X]` | office hours, lead-time in days | 15 |
| `[XXX]` | annual plan price | 2 |
| `[X,XXX]` | systems installed | 2 |
| `[X.X]` | average star rating | 2 |
| `[Customer Name]` / `[Town]` | review attributions | 3 each |

`[X]` and `[XX]` appear in several different contexts, so **review each one in
place** rather than blind-replacing them all with the same value.

### Reviews — important

The three review cards on `index.html` contain placeholder text and are marked
with an HTML comment. **Replace them with real Google reviews before launch, or
delete the section.** Publishing invented testimonials as genuine customer
feedback is deceptive and, for a licensed contractor, a real liability.

Same applies to the numbers in the stat bars — put true figures in or remove them.

---

## 2. Make the contact form actually send

The form currently validates, then tells the visitor to call instead. Nothing is
emailed anywhere. Pick one:

**Easiest — Formspree** (free tier, no backend)
1. Create a form at [formspree.io](https://formspree.io), copy your form ID.
2. In `contact.html`, change:
   ```html
   <form data-quote-form novalidate>
   ```
   to:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
   Removing `data-quote-form` is what disables the JS interception.

**If you host on Netlify** — change it to `<form name="quote" method="POST" data-netlify="true">`
and Netlify captures submissions automatically.

Either way, delete the "not connected to email yet" line in
`assets/js/site.js` once it's live.

---

## 3. Putting it online

Drag the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop) —
it's live in about thirty seconds, free, with HTTPS. Then point your domain at it.

Cloudflare Pages and Vercel work the same way. Any traditional web host works too:
upload the folder contents by FTP into `public_html`. There is nothing to build.

**Before going live**, add real values for the `<title>` and `<meta name="description">`
if you change page names, and set up a Google Business Profile — for a local
contractor that drives more calls than the website itself will.

---

## 4. Things worth knowing

**The hero video** (`media/hero video.mp4`) is muted, looping, and autoplays.
It's referenced as `hero%20video.mp4` because the filename contains a space —
if you rename the file, update `index.html` line ~78 to match. Visitors with
"reduce motion" enabled, or whose browser blocks autoplay, get the still image
(`media/1.webp`) instead. That fallback is automatic.

Note the video is 1920×1080 — check its file size. If it's over ~8 MB it will
hurt load times on phones; compress it with [HandBrake](https://handbrake.fr)
before launch.

**The before/after sliders** are built on a native range input, so they work with
a mouse, a finger, *and* the arrow keys. That keyboard path is a WCAG 2.2
requirement, not a nicety — please don't swap in a drag-only script.

**The logo** used across the site is `media/newlogo-trimmed.webp`, not
`media/newlogo.webp`. The original has a large transparent margin — the badge
fills only 40% of its width and 73% of its height — so at header size the mark
rendered small inside a wide, mostly empty box. The trimmed version is the same
artwork with the empty margin cropped off (lossless, nothing recoloured or
rescaled), so it fills its space properly. Your original file is untouched.

If you ever replace the logo, trim the transparent padding first or it will
look undersized again. It's referenced in three places per page: the favicon
`<link>`, the header, and the footer.

**Colors** live as CSS variables at the top of `assets/css/site.css`. They're
pulled from your logo: deep navy hull, lake blue, spray highlight, sunset ember.
Two of them (`--lake-600`, `--ember-600`) were deliberately darkened from the
raw logo values to clear the 4.5:1 text contrast threshold — if you brighten
them back toward the logo, small text will fail accessibility checks.

**Fonts** are Fraunces (headlines), Public Sans (body), and JetBrains Mono
(the small gauge-style labels and stat numbers), loaded from Google Fonts.

**Content is visible without JavaScript.** The fade-in animations are an
enhancement layered on top; if the script fails, nothing disappears.

---

## 5. Local preview

```bash
python -m http.server 8123
```

Then open `http://localhost:8123`. Opening the files directly works too, but a
server is closer to how it'll behave once it's hosted.
