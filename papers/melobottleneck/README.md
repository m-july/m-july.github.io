# MeloBottleneck Audio and Piano-Roll Demo

This is a demo page for:

**MeloBottleneck: Compact Symbolic Melody Representations for Robust Retrieval**

The page shows qualitative paired audio and piano-roll examples of original melodies, MeloBottleneck skeletons, and O2B-Learner baseline skeletons. The displayed ratios are model-predicted or fixed sequence-retention settings. They describe sequence length rather than bitrate or measured file-size savings.

## File structure

```text
melobottleneck-audio-and-html-demo/
  index.html
  styles.css
  script.js
  assets/
    [group_id]-original.mp3
    [group_id]-ours-over-original.mp3
    [group_id]-o2b-over-original.mp3
    [group_id]-header.png
    [group_id]-roll.png
```

## Local preview

A direct browser open (index.html) usually works for this static page. If audio loading is restricted by your browser, run a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
