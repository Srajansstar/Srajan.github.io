# Srajan Agarwal — personal research website

A build-free portfolio with a large graph brain and an interactive network
background. The biography is part of the opening. Research comes next, followed
by Education, Publications, Experience, Beyond research, Sketchbook and Contact.

The brain is fitted to its padded area. Background nodes respond to the pointer;
clicking the opening sends a gentle wave through the graph. Pause and reduced-
motion preferences are respected. The right-hand text area stays quiet.

Two main projects use `featured: true` in content.js for larger cards. Other
projects are compact. Publications, experience and education use a similar
visual hierarchy.
## Run
Open `index.html`, or run `python3 -m http.server 8000`.
No installation or API keys are needed.

## Add your sketches
1. Put your drawing images in `assets/` (for example `sketch-01.jpg`).
2. Open `content.js` and find `window.SKETCHES` near the bottom.
3. Set each drawing’s title, image and optional caption:

```js
{ "title": "A pencil study", "image": "assets/sketch-01.jpg", "caption": "Graphite on paper" }
```

Empty image paths show labelled paper placeholders. No sample drawings are
presented as your work. Added images open at full size when clicked. Change
“I’ll be adding some of my sketches here soon” in the HTML when adding artwork.

## Other edits
- `index.html`: biography, education, papers, experience and personal sections.
- `content.js`: research summaries and project details. An optional project
  `image` path adds a real figure; otherwise projects stay text-led.
- `style.css`: colours, spacing, typography and responsive layouts.
- `brain.js`: subtle brain movement; pause and reduced-motion support.
- `assets/guitar.jpg` and `forest.jpg`: replace the labelled sample photos
  with your own and update their captions/alt text.
- `assets/Srajan-Agarwal-CV.pdf`: replace with a newer CV under this filename.

Education uses the supplied school names. School dates were not provided and
are intentionally omitted. The university graduation is expected August 2027.

## GitHub Pages
Upload the extracted files and assets folder to the repository root. Under Settings → Pages,
choose Deploy from a branch → main → /(root). The downloadable ZIP already
places the files at the root. Relative links also support project website URLs.
Official reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Credits
The graph brain uses clustered, mirrored NiiVue ICBM152 surface geometry; colours
and pulses are conceptual, not measured connectivity. Full attribution and the
BSD licence are in `assets/credits.txt` and `NIIVUE-LICENSE.txt`.
Sample photo assets: https://images.unsplash.com/photo-1510915361894-db8b60106cb1
and https://images.unsplash.com/photo-1441974231531-c6227db76b6e.
Google Fonts supplies Instrument Serif, DM Sans and Manrope, with system fallbacks.

## Verification
JavaScript syntax, project hierarchy, category filters, dialogs, graph drawing,
pointer/click responses and pause were checked. About appears only once in the
opening; Education follows Research. Page anchors and assets were checked.
Full browser layout verification remains unavailable in this environment.
