# Visual refresh — current review

Status: Benjamin approved committing, pushing, and publishing this redesign on November 2, 2026. Earlier local-review notes below record the review process.

## Preview

- Branch: `portfolio-visual-refresh`
- Server: `node tools/preview.cjs 8766`
- Home: `http://127.0.0.1:8766/index.html`
- About / connection board: `http://127.0.0.1:8766/about.html#connections`
- VEX: `http://127.0.0.1:8766/robotics.html`
- SDG: `http://127.0.0.1:8766/sdg.html`
- The former draft URL, `design-preview.html`, redirects to Home.

## Current user direction

Fewer words, more photographs and video. Combine cinematic/dark with playful/experimental design. The first homepage direction was decent; retain the photo-print treatment and restore Benjamin’s large cutout portrait. Prioritize About, VEX, and SDG. Keep the top bar clean while exposing subpages and subsections in the menu.

Benjamin supplied a detective-board reference: strings connect photographs and activity dots. The implementation uses original activity media and native links on About, with a small visual teaser on Home. Dynamic SVG strings follow real photo pins. Keyboard focus and pointer entry highlight adjacent threads. On phones the cards reflow to two columns.

## Implemented this round

- Restored the existing large cutout in Home’s photo frame; added a connection-board teaser.
- Rebuilt About around seven activity cards and a central portrait, with a short profile and expandable toolkit.
- Rebuilt VEX with team photography, three concise contribution descriptions, a full-frame hardware gallery, shared code links, and a team photo mosaic.
- Added `sdg.html`; moved the longer SDG work out of Activities. Preserved original posters, adjacent factual corrections, and shared achievement attribution.
- Shortened Activities around SPROUT and badminton, preserving old section anchors.
- Added the same Explore menu to every active page, including direct project and subsection links.
- Preserved previous public homepage fragments as aliases and synchronized the media manifest.

## Next review

Discuss the connection-board appearance, portrait size, navigation labels, VEX story flow, and SDG layout. Benjamin will provide more VEX photographs and videos; no invented or placeholder footage has been added. Retained Environment, Research, AMR, Honors, and Contact content currently has the new menu and its prior body design.

## Verification

Browser review covers desktop and 390px phone layouts, no horizontal overflow on refreshed pages, board cards contained within the board, 11 strings correctly positioned, keyboard connection highlighting, Escape-to-close Explore, phone menu navigation to SDG, VEX hardware framing, and the existing native video/reduced-motion behavior. Syntax and whitespace checks pass. The repository audit reports only the four pre-existing issues in untouched `01.html` (metadata, h1, description, image alt). Original project media are unchanged.


## Latest round / All active subpages

Benjamin requested the original-style unframed, highlighted head on Home, a cleaner lower homepage layout, and a creative topic-specific design for every subpage. He confirmed 8066 = PID tuning, 8106 = right autonomous, and 8128 = left autonomous; he wrote both autonomous programs.

Implemented: silhouette-highlighted unframed Home portrait; aligned SDG/badminton rows with bookmark anchors removed from grid flow; ocean/flight field journey; matched-frame Fish AI comparison and evaluation bench; AMR blueprint/hardware inspector; VEX video playbook; SDG lab notebook; Activities court illustration; Honors milestone collection; Contact postcard. About retains the approved photo connection board. All project and subsection links remain in Explore.

The three new MP4s and their posters are in `portfolio-assets/vex/video/`. Originals are untouched. The PID recording is intentionally presented as the supplied short two-second clip. No measured PID gains or response plots are claimed.

Browser QA: all ten active pages have no horizontal overflow at 390px; desktop layouts checked at 1440px. Comparison keyboard input updates the reveal. AMR view selection shows one panel. All three VEX clips play; hidden videos pause; arrow keys switch routine tabs. Flight replay starts movement, and reduced motion fixes the plane at the endpoint and disables replay. The lower Home cards align and have equal heights. Original AMR bookmarks are retained. No publication or push has been performed.

Final media/link check: 91 distinct local pages/assets return HTTP 200; 65 media keys and 467 local references checked. Only the four known legacy `01.html` markup issues remain. The audit’s prose-only superseded-percentage check was scoped to HTML/Markdown so legitimate CSS percentages do not trigger a false alarm. Browser console review showed no warnings or errors.


## Latest correction / Robot identity and original intro

The separate front-view VEX build was mainly built by Benjamin. The tall photograph is the team skills-challenge X-drive robot, with incomplete control programming and an unsuccessful attempt. Captions, alt text, full-image link labels, and the media inventory reflect this distinction. The original multilingual greeting animation has been restored to Home. Keep it in future redesigns; preserve its six greetings, identity/aperture sequence, skip/replay controls, every-refresh behavior, and reduced-motion support.

Restoration checks: original intro timeline tests pass, including Bonjour, refresh/revisit, pointer/key skip, deep links, and reduced motion. Added a homepage integration guard so future redesigns cannot silently unload the intro. Browser verification observed 你好 playing, automatic completion, replay, and keyboard skip with focus returned to the current hero heading. Both corrected robot descriptions are present in the rendered VEX gallery.

## November 2 / Robot explorer and engineering notebook

Benjamin approved clickable robot mechanisms, the notebook, smaller inner-page openings/readable captions, and video compression. He explicitly skipped a deeper X-drive failure story. He confirmed the notebook documents the team robot, while his separate build must stay distinct.

Implemented `robot-notebook.js` and `robot-notebook.css`: two clearly attributed robot views, four selectable mechanism callouts per view, highlighted hardware regions, and relevant notebook links for the team build. The main team competition robot opens by default; Benjamin's separate build remains the second option with descriptions of its visible assemblies. The team notebook is not used as evidence for that separate robot.

The original 439-page PDF is copied unchanged to `portfolio-assets/vex/notebook/reaper-engineering-notebook.pdf`. The page-flipping reader uses 439 optimized 1600px WebP facsimiles (46.5 MiB total), loading only displayed pages. It has chapter shortcuts, previous/next, page entry, arrow/Home/End keys, page enlargement, and extracted reading text. Two-page desktop spreads become single pages on phones. Reduced motion bypasses flipping. The source PDF remains available separately. Chapter shortcuts include Benjamin's aligner entries (323), wing entries (336), repairs (352), and team practice (421). Historical source text is exempt from current-profile wording rules, preserving its original dates, member grades, and attribution.

Inner page-intro headings and spacing are smaller; documentary captions are at least 12px, including phones. The Home portrait and original greeting animation remain intact.

The three VEX web videos were recompressed directly from the original MOVs to H.264 MP4 at 30fps, maximum long edge 1280px, target 2.5 Mbps, AAC audio, no metadata, network-optimized layout. Web copies went from 48,310,451 bytes total to 11,135,157 bytes (77% smaller). Right: 5,035,912 bytes / 15.333s; left: 5,426,056 bytes / 16.3s; PID: 673,189 bytes / 1.967s. Native orientation and original frame content are preserved; source MOVs are untouched. Browser playback of all three passes with readyState 4 and advancing currentTime; hidden clips pause.

Verification: 99 distinct local pages/assets return HTTP 200. The audit checks 509 local references and 66 media keys, with only the four known issues in untouched `01.html`. Notebook chapter selection, mechanism-to-page linking, animated next/previous, keyboard navigation, page entry, first/last boundaries, single-page phone layout, no transient horizontal overflow, and reduced-motion behavior were checked. All nine inner pages fit at 390px; Home fits after its original greeting finishes/skips. Intro regression tests and JS syntax/whitespace checks pass. Still local review only; nothing committed, pushed, or published.

Main robot priority correction: Benjamin confirmed the side-view competition robot is the primary analysis subject. It is now first in the selector and the default in HTML and JavaScript. His separate build remains available second.

## Publication approval / November 2, 2026

Benjamin requested pushing the reviewed redesign to GitHub. Publish the approved portfolio and media through the existing GitHub Pages repository. Preserve the main competition robot as the default explorer, the separate build as the second option, and the original multilingual intro.

## Wing callout / November 3, 2026

Added a fifth main-robot callout on the raised hook/wing. The description explains active descoring and moving blocks toward the control-bonus section, with a direct notebook link to page 337. Pages 340–342 support the pneumatic actuation, frame, and return/retraction details. The fifth selector spans the full row on desktop and phones. The separate build retains its four distinct callouts.
