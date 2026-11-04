# Fish AI website chart data

These CSV files are published aggregate research results from Benjamin Sung's AquariumFishAI repository. No raw frames, labels, individual records, or predictions were copied.

Source revision: `61945bce3daf20857ef1b0d926ef3f30a753141b` (2026-10-25). Retrieved 2026-11-04.

- [Aggregate results](https://github.com/benjisung/AquariumFishAI/blob/61945bce3daf20857ef1b0d926ef3f30a753141b/results/aggregate_results.csv)
- [Paired bootstrap intervals](https://github.com/benjisung/AquariumFishAI/blob/61945bce3daf20857ef1b0d926ef3f30a753141b/results/paired_bootstrap_95ci.csv)
- [Per-class results](https://github.com/benjisung/AquariumFishAI/blob/61945bce3daf20857ef1b0d926ef3f30a753141b/results/per_class_results.csv)

The final independent test uses 60 frozen frames and 428 annotated boxes from one later recording of the same aquarium installation. It is separate from the 60-frame adaptation set and the archived 30-frame evaluation. Confidence intervals use 10,000 paired frame-level percentile bootstrap replicates, seed 20260918; they do not estimate variation across independent aquariums. The mAP averages include only the six classes with positive ground truth. The two absent classes do not have estimated AP, although their detections count as thresholded false positives.

The graphs use the source point estimates and intervals without new inference. They do not describe the open-ocean YouTube cameras or the NYCU–NMMBA labeling collaboration. Camera affiliation and Benjamin's labeling contribution were described by Benjamin on 2026-11-04; the public broadcast is credited separately to its YouTube channel, 台電-南灣海域珊瑚觀測計畫.

Regenerate figures with `python tools/build-fish-charts.py` in an environment with Matplotlib. Each chart has desktop/mobile SVGs and standalone PNGs. Public data links stay pinned to the source revision, so later repository changes do not silently alter a published graph.

The original v1/v2 `results/development_validation/<model>/results.png` files from the same pinned revision are copied unchanged as `v1-training-curves.png` and `v2-training-curves.png`. They are expandable development diagnostics, not final-test measurements.

The two user-supplied final-test confusion matrices are preserved unchanged as `v1-final-confusion-matrix.png` and `v2-final-confusion-matrix.png`, side by side in a compact two-column comparison with full-size links. Their color scales differ. The pinned evaluator uses confidence-ordered overlap matching across classes for matrices, versus class-aware matching for headline metrics; this explains why V2 has 225 diagonal matches versus 226 headline true positives. Background cells alone do not equal the headline FP/FN counts. See `scripts/evaluation/compare_final_test.py` at the source revision above.
