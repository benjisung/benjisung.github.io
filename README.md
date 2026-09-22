# Benjamin Sung — Portfolio v4

A static, photo-led Graphite / Sky Mint engineering portfolio for Benjamin Sung, a Grade 12 student at Wego High School International Program in Taiwan. Environmental Engineering and Mechanical Engineering remain central interests, connected with Computer Science, Bioengineering, Environmental Science, robotics, and computer vision through physical and living systems. Preferred name: Benjamin Sung; legal name: Chi-Hsuan Sung; Chinese name: 宋其軒. Contact: benjisung@gmail.com.

This redesign starts from deployed commit `538c16043a405f4c76522359df38e7e8f23209bc` on the isolated `portfolio-v4-redesign` branch. It is a local review version, not a deployment.

## Preview

With Node.js installed, run:

```sh
node tools/preview.cjs 8766
```

Open http://127.0.0.1:8766/. The server binds to loopback only and serves public HTML, CSS, JavaScript, image assets, and MP4 video (including byte-range requests); it does not serve Git metadata. No build step, framework, or package installation is needed.

The previously deployed site remains at [benjisung.github.io](https://benjisung.github.io/). Do not commit or push the redesign until visual approval.

## Pages

- `index.html`: personal narrative — identity, five multi-stage projects (Pathfinders, Fish AI, AMR, VEX, SDG), life beyond engineering, and contact.
- `about.html`: biography, development threads, tools.
- `environment.html`: completed Taiwan Global Pathfinders program, NMMBA preparation, HIMB learning.
- `research.html`: NYCU learning and the independent aquarium deployment case study.
- `robotics.html`: full-team photographic opening, VEX personal contributions, team build archive, and teamwork.
- `amr.html`: separate independent AMR platform, architecture, and hardware, connected by the Robotics project tabs.
- `activities.html`: SDG projects, SPROUT, badminton leadership; old project anchors are retained.
- `honors.html`: academic and team-project recognition.
- `contact.html`: email and school.
- `funfacts.html`: retired; a small compatibility redirect leads old bookmarks to About. All Fun Facts links and quiz behavior are removed.
- `01.html`: preserved early HTML exercise, with basic markup and local-image repairs.

## Implementation

Shared styling is in `style.css`, `cinematic.css`, `chapters.css`, and `stories.css`; progressive enhancement is in `site.js`, `cinematic.js`, `chapters.js`, and `stories.js`; the bounded every-refresh greeting is in `intro.js`.

- Native scrolling, IntersectionObserver reveals, requestAnimationFrame-throttled chapter/sequence updates, and CSS sticky layouts.
- No GSAP, framework, animation CDN, remote fonts, or tracking. The optional intro is not tied to loading or network requests.
- Home has five persistent project chapters and 16 internal stages: Pathfinders (4), Fish AI (3), AMR (3), VEX (3), SDG (3). No separate title-gate pages. Native scrolling changes the content within a viewport; phase links, a project index, and persistent detail-page links also work with keyboard input. Reduced motion, no JavaScript, and short viewports show a normal reading layout.
- Inner-page hero photographs, SDG teacher/team galleries, About galleries, and low-opacity documentary backgrounds preserve readable copy. Reduced motion removes sticky project holds and camera transforms. Technical evidence remains available in the detail pages.
- Cross-document CSS View Transitions connect the shared header, coral image and robot architecture where supported. Other browsers use ordinary links without delay.
- System reduced-motion preferences and a device-local footer motion control disable animated reveals, long sticky sequences, and transitions. No content depends on animation.
- Semantic landmarks, skip link, keyboard-accessible menu, Escape-to-close, visible focus, and keyboard-operable project links and image comparison.

## Content boundaries

- Pathfinders: independently prepared proposal; approximately NT$280,000 government funding; completed field-learning program, not original conservation findings.
- NYCU: summer 2026 learning at the Adaptive Photonics Laboratory in Tainan; daily guidance mainly from a senior lab member.
- Lab dataset: 10 classes; 1,292 original / 1,104 clean images; 80/20 train-validation split.
- Independent aquarium: 8 classes; 419 images; approximately 5,100 boxes; 60 labeled full-tank adaptation images (48 train / 12 validation), with unlabeled equipment as hard-negative context.
- Final frozen validation: 60 manually annotated frames / 428 ground-truth boxes; v2 precision 74.10%, recall 52.80%, F1 61.66%, mAP@50 58.20%, mAP@50:95 30.34%. At confidence 0.35 and class-aware matching IoU 0.50: TP 226, FP 79, FN 202. AP uses a 0.001 floor and averages the six positive-GT classes. The older 30-frame metrics are superseded; the unmodified archived video and confusion matrix are explicitly labeled.
- ByteTrack, long-duration monitoring, and live/livestream tests continue. This is a deployment project, not a publication.
- AMR: assembled 24V differential-drive platform with STM32, Jetson Orin Nano Super 8GB, ROS 2 Humble, joystick and proportional speed control. Advanced sensing, navigation, and autonomy remain in development.
- VEX: team-built robots; Benjamin contributed programming, functional troubleshooting, mechanism ideation, testing, and tuning using C++ / PROS, PID, and odometry. Create and Sportsmanship are team awards.

## Team-site integration and imagery

Team context is paraphrased and linked to [Reaper 23083Z](https://23083z.com/). Personal contributions are separate from shared team work. Published season plans are not presented as completed competition results.

The September media pass imports selected real photos from the user-prepared portrait, Pathfinders, AMR, VEX, badminton, and SDG folders, plus archived fish-AI evidence from AquariumFishAI. Originals are untouched. The current palette uses Graphite #25272C and Sky Mint #B8F7E4. Space Grotesk and JetBrains Mono are self-hosted with their SIL Open Font License files in assets/fonts/. Build views have no invented generation numbers or dates. The AMR diagram remains conceptual architecture, not fabricated CAD.

Matched raw/v1/v2 frames, an adaptation training example, exploratory tracking, an early live-input test, the independent confusion matrix, and a silent 71-second demo are integrated. Historical species/metric labels are explained without altering archived evidence. The live screenshot is not proof of completed live detection.

## Intro and media

The intro cycles six greetings at 190 ms intervals, shows 宋其軒 / Benjamin Sung / Chi-Hsuan Sung, and opens a mint aperture into the hero. The aperture starts at 1.8 seconds and overlaps the image/text entrance. It ends by 2.75 seconds, with a separate CSS fail-open deadline at 2.8 seconds. Any click or key skips it. Home plays the intro on every normal page load and every refresh; it no longer checks session storage. A footer Replay intro button allows explicit replay. System reduced motion and the footer motion preference bypass it. Direct deep links skip it, but refreshing an anchored Home page still replays it. Storage access is not required. Content never waits for assets.

[MEDIA_PLAN.md](MEDIA_PLAN.md) and `assets/media-plan.json` document 62 media keys: 58 populated and 4 pending. The selected derivatives comprise 58 WebP images and one original MP4. Each entry lists page, section, content, orientation, crop, priority, current file if any, and suggested future path. Used files live under `portfolio-assets/`; paths for the four pending slots are not requested. Highest-value additions are a clean AMR portrait, STM32 detail, ROS/RViz screenshot, movement video, and a current integrated live-detection interface.

All technical screenshots, hardware, charts, diagrams, and video use full-frame `contain` (the AMR home photograph also uses a decorative mint blend). Portraits and documentary photos may use a controlled `cover` crop. Keep the `data-asset-key` when replacing a placeholder. Do not use stock/generated evidence.

## Checks

```sh
node --check site.js
node --check intro.js
node --check cinematic.js
node tools/test-intro.cjs
node --check tools/preview.cjs
node tools/audit.cjs
node tools/audit.cjs --http
```

The HTTP option expects the preview server on port 8766. An optional one-off semantic HTML check is:

```sh
npx --yes html-validate --rule doctype-style:off --rule void-style:off "*.html"
```

Only the two formatting conventions that differ from Prettier (doctype casing and void-element slashes) are excluded; semantic and accessibility rules remain enabled. This does not add a runtime dependency to the site.

The audit checks local links, fragments, asset filename case, duplicate IDs, required metadata, and outdated wording. Browser QA covers desktop 1440×900, mobile 390×844, tablet, menu, scrolling, motion control, Robotics project tabs, every-refresh intro, and console output.

## Cinematic refinement / September 20

The home page now uses a full-bleed conversation photograph, an AI-assisted photographic cutout of Benjamin, a short journey strip, a native-scroll three-photo HIMB aperture sequence, four field photographs, a keyboard-accessible matched-frame comparison, a mint AMR hardware chapter, a VEX photo mosaic, and a badminton composition. Detailed factual context remains on the linked pages. No scroll hijacking, forced snap, animation dependency, external font requests, or generated research evidence.

The original HIMB portrait remains directly linked. Only the hero cutout uses image generation for background extraction; see [MEDIA_PLAN.md](MEDIA_PLAN.md) for provenance and the exact prompt. Source photographs, original working tree, Git history, and deployment were not modified.

## Final fish-validation metric update

Source: `C:/Users/user/AI/AquariumFishAI/runs/evaluation/cjsj_final_validation_60/aggregate_results.csv`, `comparison_summary.md`, `integrity_report.json`, and `docs/cjsj_final_validation_60_evaluation_protocol.md`. The corrected bootstrap summary confirms the same point estimates. The project, model weights, annotations, images, and original MP4 are read-only sources; no evaluation was rerun. Website values are percentages rounded to two decimals. Homepage, Research, video caption, and archived-figure description consistently distinguish final 60-frame validation from the earlier 30-frame test and the separate 60-image adaptation set.

## Photo-led project chapters / September 21

Every active inner page now has a real photograph behind its main heading. Robotics begins with the full Reaper team photo and separates VEX (`robotics.html`) from AMR (`amr.html`) using link-based tabs, so each works without JavaScript and supports direct links. Existing AMR anchors redirect to the corresponding AMR page when JavaScript is available; site links point directly to the new page. Homepage projects now use multi-stage story viewports with direct phase links and detail-page links, never blocking timed overlays. Contextual Wego, USACO, SPROUT, and Reaper logos come from the supplied files; they are not endorsement claims.


## Multi-stage story refinement / September 22

HCC lecture and exhibition photos appear together; NMMBA preparation uses Benjamin’s coral photograph, and diving at 18 m and PADI certification have distinct captions. Warm Pacific-route accents complement Graphite / Sky Mint. Moku o Loʻe naming and the explicitly attributed institutional island image reference the official HIMB site. The original Heron’s Fountain poster is accompanied by a correction of its historical perpetual-motion / hydroelectricity wording. National champion wording is user-confirmed and marked as team recognition. Contact uses a one-shot, reduced-motion-aware email typing reveal without changing its accessible name or mailto target.
