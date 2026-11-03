# Benjamin Sung — Portfolio

A static engineering portfolio hosted on GitHub Pages. Preferred name: Benjamin Sung; legal name: Chi-Hsuan Sung; Chinese name: 宋其軒. Contact: benjisung@gmail.com.

## Publication status

Benjamin approved publishing the visual redesign on November 2, 2026. The approved source is deployed through the repository’s existing GitHub Pages setup.

The direction combines charcoal and mint, oversized typography, offset photo prints, shorter copy, and real project media. The homepage has an unframed, silhouette-highlighted portrait and aligned project rows. About connects activity photographs with strings. VEX includes Benjamin’s two autonomous routines and PID tuning clip in a keyboard-accessible video selector. SDG has a student notebook treatment. The shared Explore menu exposes every project and key subsection.

## Preview

```sh
node tools/preview.cjs 8766
```

Open http://127.0.0.1:8766/. No package installation or build step is required. The server binds to loopback and supports MP4/PDF byte ranges while refusing Git metadata and non-public file types. `design-preview.html` redirects to the current local homepage.

## Pages

- `index.html`: image-led project overview, portrait, Fish AI video, and link to the connection board. Earlier public homepage fragments are retained as aliases.
- `about.html`: interactive activity connection board, brief background, expandable toolkit.
- `robotics.html`: separate/team robot explorer, 439-page flipping team notebook, autonomous videos, personal contributions, shared team engineering, and an embedded live view of 23083z.com.
- `sdg.html`: Heron’s Fountain, microplastic separation concepts, Ocean Challenge, AI Fridge, team science, and recognition.
- `activities.html`: SPROUT, programming, badminton, and a link to SDG. Existing SDG, Pathfinders, and fish-detection fragments remain available.
- `environment.html`: ocean atmosphere, replayable Taiwan–Hawaiʻi flight, reef field notebook, and real field photographs.
- `research.html`: matched-frame image comparison, training context, frozen validation readouts, and the original archived demo.
- `amr.html`: blueprint grid, switchable real hardware views, and the retained conceptual architecture.
- `honors.html`: academic milestone collection and clearly attributed shared achievements.
- `contact.html`: photographic postcard with a direct email link.
- `funfacts.html`: retired compatibility redirect. `01.html`: preserved early HTML exercise.

## Source structure

All active pages use `visual-refresh.css`, `detail-refresh.css`, and `creative.css`. `creative.js` supplies media tabs, the matched-frame comparison, and visibility-triggered flight/court scenes. Animations respect system and footer reduced-motion preferences. Videos have native controls, no autoplay, and are paused when their panel or browser tab is hidden. All active pages share `navigation.css` and `navigation.js`; navigation markup is present in HTML and works without JavaScript. Native details exposes the Explore panel and expandable background notes. `site.js` supplies the phone menu and reduced-motion preference.

`profile-board.js` positions SVG strings between the actual photo pins using ResizeObserver. Photo cards are ordinary links. Keyboard focus or pointer entry highlights adjacent threads and updates a short description. On phones, the board reflows to a two-column layout; it does not require dragging or horizontal panning.

The former styles and homepage story scripts remain in the repository for history. The original `intro.js` is loaded on Home again, with its styles isolated in `intro.css`: Hello, 你好, こんにちは, Bonjour, 안녕하세요, Aloha, then the original identity and mint aperture. It plays on visits and refreshes, supports skip/replay, respects reduced motion, and preserves direct deep links. `chapters.js` remains on Robotics to preserve older AMR bookmarks. Fonts are self-hosted with their existing licenses. There are no trackers, remote font calls, or new runtime dependencies.

## Content and media

Original photographs, technical evidence, and video are untouched. `assets/media-plan.json` tracks actual page slots; `MEDIA_PLAN.md` preserves source and extraction provenance. The existing hero cutout was an earlier AI-assisted background extraction, not a newly generated photograph.

Preserve these distinctions when editing:

- Pathfinders was a completed field-learning program, not original conservation research.
- Fish AI’s archived demonstration is a qualitative example. Final frozen validation uses 60 annotated frames / 428 ground-truth boxes; details remain on Research. Tracking and live deployment remain exploratory.
- AMR is assembled and joystick-controlled; advanced autonomy remains in development.
- The main VEX competition robot, repositories, and team awards reflect shared work. The front-view white-background photograph shows a separate robot built mainly by Benjamin. The tall mechanism photograph shows the team’s X-drive skills-challenge prototype, whose control programming was not completed; that attempt did not succeed. Benjamin contributed programming, troubleshooting, mechanism ideas, and testing to the team work.
- SDG projects are student demonstrations, prototypes, and early concepts. Heron’s Fountain is pressure-driven; the original poster’s power-generation claims were not validated. Competition recognition is attributed to the team.
- The badminton asset shows a racket and competition certificate, not an action photograph.

The VEX recordings are user-confirmed: `IMG_8106.MOV` → right autonomous, `IMG_8128.MOV` → left autonomous, `IMG_8066.MOV` → PID gain tuning. They are exported as metadata-filtered MP4 copies in `portfolio-assets/vex/video/`, with real-frame posters. Originals in Downloads are unchanged. Both autonomous programs were written by Benjamin; the robot remains team-built. Add only identified real media, with native video controls and no autoplay. Technical hardware, detection frames, plots, and posters retain full-frame views.

## Checks

```sh
node --check site.js
node --check navigation.js
node --check profile-board.js
node --check creative.js
node --check robot-notebook.js
node --check intro.js
node tools/test-intro.cjs
node tools/audit.cjs
node tools/audit.cjs --http
```

The HTTP audit expects port 8766. The existing audit reports four pre-existing issues in untouched `01.html` (metadata, h1, description, image alt text). Refreshed pages have no audit errors. Browser review covers desktop and phone layouts, menu discovery, card links, keyboard thread highlighting, reduced motion, and video playback. See `DESIGN_REVIEW.md` for review status and remaining work.

## Robot explorer and notebook

`robot-notebook.js` adds five selectable mechanisms to the main competition robot, including the raised descoring wing, and four to the separate build. The main competition robot is first and selected by default. The separate robot built mainly by Benjamin remains the second option. Team mechanism links open relevant pages of the unchanged 439-page team engineering notebook. `robot-notebook.css` provides the hardware highlights and page-turn effect. `notebook-data.js` holds historical extracted reading text, exempt from current-profile wording checks.

The reader loads only displayed WebP pages (1600px long edge), supports desktop spreads and single phone pages, chapter links, page entry, arrow/Home/End keys, enlargement, and reduced motion. The original PDF remains available separately; no runtime dependency or external viewer is required. The three VEX clips now total about 11 MB, 77% smaller than the earlier web copies, at 30fps with preserved orientation and native controls.

`team-site.css` supplies the embedded site layout independently of the shared stylesheet cache. The VEX page ends with a lazy-loaded live view of the official team website at `#team-site`. Its full-page fallback opens in the current tab. The embedded site has its own scroll area; the VEX rail and shared Explore menu link directly to it.
