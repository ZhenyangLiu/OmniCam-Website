# OmniCam project website

The homepage is a static HTML/CSS/JavaScript site in the dedicated public
`OmniCam-Website` repository. It requires no package manager, framework, build service, or
model environment. The public repository contains only the reviewed website, paper, figures,
and selected demonstration media. The model and research code are not currently released.
Do not add third-party analytics or copy another project’s tracking configuration.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Page content, authors, affiliations, sections, links, result tables, citation |
| `static/css/index.css` | Layout, colors, typography, responsive rules, reduced-motion styling |
| `static/js/index.js` | Gallery selection, video controls, and page interactions |
| `static/media/` | Web-ready paper figures, posters, and other derived visual assets |
| `static/paper/OmniCam.pdf` | Local preprint PDF linked from the page |
| `examples/` | Selected public demo panoramas, instructions, and planned/result MP4 media |

Keep site paths relative (`static/...`, `examples/...`) so they work under the GitHub Pages
project prefix `/OmniCam-Website/`, as well as on a local server.

## Local preview

Run this command from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Stop the server with Ctrl+C. Python is
only used to serve files locally; it is not needed by visitors or by the deployed page.

Before publishing, check the desktop and narrow-screen layouts, keyboard navigation, image
zoom, gallery scene/behavior selection, and video play/pause controls. Confirm that browser
requests for CSS, JavaScript, posters, videos, and the PDF return successfully. Review the
page with the operating system’s reduced-motion preference enabled.

## Publish with GitHub Pages

The website repository is `ZhenyangLiu/OmniCam-Website`; the existing `OmniCam` research
repository remains private. Keep their histories separate. The intended website address is
[https://zhenyangliu.github.io/OmniCam-Website/](https://zhenyangliu.github.io/OmniCam-Website/).
Adding files alone does not confirm deployment.

1. Start the public website repository with a clean history and copy only files from the
   reviewed publication allowlist. Do not copy the private repository’s Git history, model
   or dataset source code, checkpoints, environment files, benchmark bundle, or internal notes.
2. Put those website files and selected media on `OmniCam-Website`’s `main` branch. Check
   that every page, stylesheet, script, image, video, instruction, and PDF reference resolves.
3. Open **OmniCam-Website → Settings → Pages**. Under **Build and deployment**, set
   **Source** to **Deploy from a branch**, then select **main** and **/(root)** and save.
4. Check the Pages deployment run and open the address reported by GitHub. Verify the
   deployed paper and media links under `/OmniCam-Website/`.
5. For updates, transfer only reviewed public website changes. Keep the publication
   allowlist current; do not merge private research history into the public repository.

The publisher needs repository permissions to configure Pages. See GitHub’s
[publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
for the current settings and troubleshooting. No custom domain is required.

## Edit content and media

Edit prose, author affiliations, tables, and citation text in `index.html`. Keep the citation
in sync with `README.md`. The confirmed author order is Zhenyang Liu, Chenjie Cao, Yisu Zhang,
Xuhui Zuo, Xiangyang Xue, Yanwei Fu, Tengfei Wang, and Chunchao Guo. Zhenyang Liu includes
Tencent Hunyuan; Yisu Zhang lists Zhejiang University before Tencent Hunyuan. Tengfei Wang is
Project Lead; Xiangyang Xue and Yanwei Fu are Corresponding authors. Emails are currently
omitted. Do not infer conference acceptance or an arXiv identifier from the PDF’s template.

For a gallery addition, publish only the selected case’s `panorama.jpg`, `instruction.txt`,
`planned.mp4`, `result.mp4`, and any visual asset actually used on the page. Add the matching
scene/behavior data to `static/js/index.js` and any required HTML controls. Preserve the
meaning of the original instruction. A planned clip is a point-cloud render along the camera
trajectory; a result clip is the completed video. Identify the two views clearly. The existing
`wonder_*` directory spelling is a filename convention; the displayed behavior is **Wander**.

For paper figures, place optimized derivatives in `static/media/`, keep the original figure’s
content and labels, and provide a readable full-size view. Preserve image aspect ratios. Use
short descriptive alternative text rather than filenames. Replace `static/paper/OmniCam.pdf`
with the reviewed preprint when the manuscript changes, then verify its author information
and the page’s citation together.

## Performance and motion

- Use the selected MP4 files for the website; do not publish unused GIF variants.
- Load videos on demand with posters and conservative `preload` settings. Avoid downloading
  every scene or autoplaying all comparison videos when the page opens.
- Pause videos when their scene is hidden or they leave the viewport. Keep explicit play/pause
  controls and handle browsers that decline autoplay.
- Honor `prefers-reduced-motion` by reducing decorative animation and avoiding unsolicited
  motion. Keep the page and media controls usable without animation.
- Use appropriately sized image derivatives, lazy-load images below the fold, and reserve
  image dimensions to prevent layout jumps. Keep the full paper PDF out of the initial load.

## Material sources and result definitions

The gallery uses selected `examples/` panoramas, instructions, and videos. The teaser, architecture, OmniCaT dataset illustration, trajectory comparisons,
and downstream examples come from the accompanying OmniCam
manuscript. Preserve applicable attribution and licensing information for distributed material.
These assets are examples and paper figures, not live browser inference. Public resource
links should point to the paper, video demos, and citation; do not add model-code, weight,
or benchmark download links without an explicit publication decision.

Homepage dataset counts describe the paper’s OmniCaT collection: **267,700 trajectories,
9,998 scenes, and approximately 21.7M rendered frames**. These statistics describe the
research collection, not files available for download from this website. Do not invent
train/evaluation split sizes or release dates.

The primary results are the paper’s reported **OmniCaT** comparison. Director3D and GenDoP
are retrained on OmniCaT. OmniCam’s ATE is **0.868**, collision rate **10.4%**, and target
visibility **52.0%**. A **43.0% ATE reduction** compares against Director3D’s 1.522; a **62.3%
collision reduction** compares against Director3D’s 27.6%. Both use the best baseline for
that metric. The often-quoted **65.8% collision reduction** instead compares GenDoP’s 30.4%.
Visibility rises from GenDoP’s 33.6% to 52.0%, a difference of **18.4 percentage points**.
Relative reduction is `(baseline − OmniCam) / baseline`; do not confuse it with a percentage-
point difference. Collision is assessed on reconstructed navigation meshes.

Qualitative videos and reconstruction figures illustrate outputs; they do not establish
collision-free motion or a numerical reconstruction-accuracy gain. Robot success-rate
aggregation, DataDoP input/evaluation protocol, and matched planner runtime comparisons are
flagged for verification in the manuscript and should not become unsupported headline claims.
