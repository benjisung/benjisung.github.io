"""Build standalone Fish AI figures from published aggregate CSVs, never synthetic data.

Requires Matplotlib. Run from any directory; no model inference or private data is used.
"""
import csv
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/private/tmp/fish-ai-matplotlib")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.ticker import MultipleLocator, PercentFormatter
from matplotlib.lines import Line2D

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data/fish-ai"
OUT = ROOT / "portfolio-assets/fish-ai/charts"
OUT.mkdir(parents=True, exist_ok=True)
font_manager.fontManager.addfont(ROOT / "assets/fonts/SpaceGrotesk-Variable.ttf")
plt.rcParams.update({
    "font.family": "Space Grotesk", "font.size": 12,
    "text.color": "#efeee7", "axes.labelcolor": "#b6c3b4",
    "xtick.color": "#b6c3b4", "ytick.color": "#efeee7",
    "figure.facecolor": "#142019", "axes.facecolor": "#142019",
    "svg.fonttype": "path", "savefig.facecolor": "#142019",
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.spines.left": False, "axes.spines.bottom": False,
})
COLORS = {"v1": "#eab397", "v2": "#c7f3af"}
NAMES = {"v1": "V1 / controlled-tank model", "v2": "V2 / full-tank adapted"}


def read(name):
    with (DATA / name).open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


aggregate = {r["model"]: r for r in read("aggregate_results.csv")}
intervals = {(r["comparison"], r["metric"]): r for r in read("paired_bootstrap_95ci.csv")}
for row in aggregate.values():
    assert int(row["TP"]) + int(row["FN"]) == 428
    assert abs(int(row["TP"]) / (int(row["TP"]) + int(row["FP"])) - float(row["precision"])) < 1e-7


def save(fig, name):
    fig.savefig(OUT / (name + ".svg"), metadata={"Date": None, "Creator": "Matplotlib; Benjamin Sung / AquariumFishAI aggregate results"})
    fig.savefig(OUT / (name + ".png"), dpi=170, metadata={"Software": "Matplotlib"})
    plt.close(fig)


def grid(ax, maximum, step, percent=False):
    ax.set_xlim(0, maximum)
    ax.xaxis.set_major_locator(MultipleLocator(step))
    if percent:
        ax.xaxis.set_major_formatter(PercentFormatter(100, decimals=0))
    ax.grid(axis="x", color="#c7f3af", alpha=.12, linewidth=.8)
    ax.set_axisbelow(True)
    ax.tick_params(axis="both", length=0, pad=10)


def performance(mobile=False):
    fig, axes = plt.subplots(3, 1, figsize=(5.5, 9.0) if mobile else (11.8, 6.2))
    fig.subplots_adjust(left=.10 if mobile else .07, right=.88 if mobile else .93, top=.92 if mobile else .90, bottom=.10 if mobile else .14, hspace=.9 if mobile else .85)
    for ax, (key, ci_name, label) in zip(axes, [("precision", "Precision", "Precision"), ("recall", "Recall", "Recall"), ("mAP50", "mAP50", "mAP@50")]):
        ax.set_title(label, loc="left", fontsize=17 if mobile else 16, pad=14)
        values = [float(aggregate[m][key]) * 100 for m in ("v1", "v2")]
        ax.plot(values, [.25, .75], color="#52634f", linewidth=1.5, zorder=1)
        for model, y, value in zip(("v1", "v2"), (.25, .75), values):
            ci = intervals[model, ci_name]
            low, high = float(ci["ci_2_5_percentile"]) * 100, float(ci["ci_97_5_percentile"]) * 100
            assert low <= value <= high
            ax.errorbar(value, y, xerr=[[value-low], [high-value]], fmt="o", color=COLORS[model], capsize=5, markersize=8, linewidth=2, zorder=3)
            ax.annotate(f"{value:.2f}%", (high, y), xytext=(8, 0), textcoords="offset points", va="center", color=COLORS[model], fontsize=13 if mobile else 14, weight="bold", bbox={"facecolor": "#142019", "edgecolor": "none", "pad": 1.5}, zorder=4)
        ax.set_ylim(-.05, 1.05)
        ax.set_yticks([.25, .75], labels=["V1", "V2"])
        grid(ax, 100, 25 if mobile else 20, percent=True)
    axes[-1].set_xlabel("Score (%)", labelpad=12)
    save(fig, "model-performance" + ("-mobile" if mobile else ""))


def outcomes(mobile=False):
    fig, axes = plt.subplots(3, 1, figsize=(5.5, 9.0) if mobile else (11.8, 6.6))
    fig.subplots_adjust(left=.10 if mobile else .07, right=.91, top=.92 if mobile else .90, bottom=.10 if mobile else .14, hspace=.9)
    for ax, (key, label) in zip(axes, [("TP", "Correct detections / higher is better"), ("FP", "False positives / lower is better"), ("FN", "Missed fish boxes / lower is better")]):
        ax.set_title(label, loc="left", fontsize=13 if mobile else 15, pad=12)
        for model, y in (("v1", .7), ("v2", .2)):
            value = int(aggregate[model][key])
            ax.barh(y, value, height=.28, color=COLORS[model], zorder=2)
            ax.text(value + 9, y, str(value), va="center", fontsize=14, color=COLORS[model], weight="bold")
        ax.set_ylim(-.1, 1)
        ax.set_yticks([.7, .2], labels=["V1", "V2"])
        grid(ax, 450, 100)
    axes[-1].set_xlabel("Box-level count across 60 test frames", labelpad=12)
    save(fig, "detection-outcomes" + ("-mobile" if mobile else ""))


def species(mobile=False):
    rows = read("per_class_results.csv")
    present = [r for r in rows if r["model"] == "v2" and r["status"] == "present"]
    original = {r["class_id"]: r for r in rows if r["model"] == "v1"}
    fig, ax = plt.subplots(figsize=(5.5, 10.5) if mobile else (11.8, 6.1))
    fig.subplots_adjust(left=.07 if mobile else .31, right=.86 if mobile else .93, top=.90, bottom=.10)
    for i, row in enumerate(present):
        y = len(present) - 1 - i
        v1, v2 = float(original[row["class_id"]]["AP50"]) * 100, float(row["AP50"]) * 100
        ax.plot([v1, v2], [y, y], color="#52634f", linewidth=2)
        ax.scatter([v1, v2], [y, y], color=[COLORS["v1"], COLORS["v2"]], s=60, zorder=3, clip_on=False)
        ax.annotate(f"{v2:.1f}%", (v2, y), xytext=(8, 0), textcoords="offset points", va="center", color=COLORS["v2"], fontsize=12)
        label = row["manuscript_name"].replace("_", " ")
        if mobile:
            ax.text(0, y+.32, label, fontsize=12, fontstyle="italic")
    if mobile:
        ax.set_yticks([])
    else:
        ax.set_yticks(range(len(present)), labels=[r["manuscript_name"].replace("_", " ") for r in reversed(present)], fontstyle="italic")
    ax.set_ylim(-.5, len(present)-.4 if mobile else len(present)-.6)
    grid(ax, 100, 25 if mobile else 20, percent=True)
    ax.set_xlabel("AP@50 (%) / six classes present in ground truth", labelpad=14, fontsize=10 if mobile else 12)
    ax.legend(handles=[Line2D([0], [0], marker="o", color="none", markerfacecolor=COLORS[m], markeredgecolor=COLORS[m], label=m.upper()) for m in ("v1", "v2")], frameon=False, ncol=2, loc="upper left", bbox_to_anchor=(0, 1.06), labelcolor="#efeee7")
    save(fig, "species-ap50" + ("-mobile" if mobile else ""))


for mobile in (False, True):
    performance(mobile)
    outcomes(mobile)
    species(mobile)
print("Built six standalone SVG/PNG figures from published aggregate data.")
