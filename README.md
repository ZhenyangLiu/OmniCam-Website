# OmniCam project website

Website for **OmniCam: Omni-Camera Trajectory Generation via Geometry-Grounded Pose Token Learning**.

OmniCam generates scene-aware camera trajectories from a single panorama and a language
instruction. The project page presents the method, reported results, OmniCaT dataset design,
and nine precomputed video examples across four camera behaviors: **Target, Surround,
Reconstruct, and Wander**.

- [Project website](https://zhenyangliu.github.io/OmniCam-Website/)
- [Paper PDF](static/paper/OmniCam.pdf)
- [Video demos](https://zhenyangliu.github.io/OmniCam-Website/#explore)
- [Citation](https://zhenyangliu.github.io/OmniCam-Website/#citation)

## Public content

This repository contains the static project website, paper, figures, and selected demo
media. The model and research code are not currently released. Model weights and benchmark
downloads are not part of this website publication.

The videos are precomputed examples. Planned views show point-cloud renders along the
camera trajectories; completed views use a downstream rendering pipeline.

## Preview and maintenance

The website uses plain HTML, CSS, and JavaScript with no build step. From the repository
root, run:

```bash
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). See [WEBSITE.md](WEBSITE.md) for content editing,
media guidance, and deployment from the dedicated website repository.

## Citation

```bibtex
@misc{liu2026omnicam,
  title  = {OmniCam: Omni-Camera Trajectory Generation via Geometry-Grounded Pose Token Learning},
  author = {Liu, Zhenyang and Cao, Chenjie and Zhang, Yisu and Zuo, Xuhui and Xue, Xiangyang and Fu, Yanwei and Wang, Tengfei and Guo, Chunchao},
  year   = {2026},
  note   = {Preprint},
  url    = {https://zhenyangliu.github.io/OmniCam-Website/}
}
```
