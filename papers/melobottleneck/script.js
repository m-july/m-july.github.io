const ASSET_BASE = "assets";

const SAMPLES = [
  {
    id: "irishman-valid-no80",
    title: "IrishMAN #valid-80",
    region: "Irish",
    data: "IrishMAN #valid-80",
    split: "held-out valid set",
    compression: {
      ours: { mode: "Predicted", arrow: "→", value: "0.3563" },
      baseline: { mode: "Fixed", arrow: "←", value: "0.3563" }
    }
  },
  {
    id: "jiugong-test-no372_1",
    title: "Jiugong Dacheng #372.1",
    region: "Chinese",
    data: "Jiugong Dacheng #372.1",
    split: "held-out test set",
    compression: {
      ours: { mode: "Predicted", arrow: "→", value: "0.5301" },
      baseline: { mode: "Fixed", arrow: "←", value: "0.5301" }
    }
  },
  {
    id: "MTC_FS_INST_2_0-noNLB073942",
    title: "MTC-FS-INST-2.0 #NLB073942",
    region: "Dutch",
    data: "MTC-FS-INST-2.0 #NLB073942",
    split: "in-train",
    compression: {
      ours: { mode: "Fixed", arrow: "←", value: "0.5000" },
      baseline: { mode: "Fixed", arrow: "←", value: "0.5000" }
    }
  },
  {
    id: "essens-no_romani22",
    title: "Essen’s Folksong #romani22",
    region: "Romania",
    data: "Essen’s Folksong #romani22",
    split: "in-train",
    compression: {
      ours: { mode: "Fixed", arrow: "←", value: "0.4000" },
      baseline: { mode: "Fixed", arrow: "←", value: "0.4000" }
    }
  }
];

const AUDIO_TRACKS = [
  {
    key: "original",
    label: "Original",
    description: "Original melody audio",
    suffix: "original.mp3"
  },
  {
    key: "ours",
    label: "Ours (MeloBottleneck) overlaid",
    description: "Extracted skeleton over original audio",
    suffix: "ours-over-original.mp3"
  },
  {
    key: "baseline",
    label: "Baseline (O2B-Learner) overlaid",
    description: "Baseline skeleton over original audio",
    suffix: "o2b-over-original.mp3"
  }
];

function assetPath(sampleId, suffix) {
  return `${ASSET_BASE}/${sampleId}-${suffix}`;
}

function sampleAnchor(sample) {
  return `sample-${sample.id}`;
}

function renderNav() {
  const nav = document.querySelector("#sample-nav");
  nav.innerHTML = SAMPLES.map((sample, index) => (
    `<a href="#${sampleAnchor(sample)}">Sample ${index + 1}: ${sample.region}</a>`
  )).join("");
}

function renderCompressionCard(modelLabel, item) {
  return `
    <div class="compression-card">
      <span class="compression-card__model">${modelLabel}</span>
      <span class="compression-card__value">
        <span class="compression-card__mode">${item.mode} ${item.arrow}</span>
        ${item.value}
      </span>
    </div>
  `;
}

function renderAudioCard(sample, track) {
  const src = assetPath(sample.id, track.suffix);
  return `
    <article class="audio-card" data-audio-card>
      <div class="audio-card__label">
        <strong>${track.label}</strong>
        <span>${track.description}</span>
      </div>
      <audio controls preload="metadata" src="${src}">
        Your browser does not support the audio element.
      </audio>
      <div class="asset-note" hidden>Audio file not found: <code>${src}</code></div>
    </article>
  `;
}

function renderSample(sample, index) {
  const headerSrc = assetPath(sample.id, "header.png");
  const rollSrc = assetPath(sample.id, "roll.png");

  return `
    <article class="sample-card" id="${sampleAnchor(sample)}">
      <header class="sample-card__head">
        <div>
          <div class="sample-index">Sample ${index + 1}</div>
          <h2>${sample.region}</h2>
          <p class="sample-subtitle">${sample.data}</p>
        </div>
        <div class="meta-grid" aria-label="Sample metadata">
          <span class="meta-pill"><strong>Data split</strong> · ${sample.split}</span>
        </div>
      </header>

      <div class="compression-grid" aria-label="Retention ratios">
        ${renderCompressionCard("Ours (MeloBottleneck) retention ratio", sample.compression.ours)}
        ${renderCompressionCard("Baseline (O2B-Learner) retention ratio", sample.compression.baseline)}
      </div>

      <section class="roll-panel" aria-label="Piano roll visualization">
        <div class="roll-tools">
          <div>
            <div class="section-label">Piano-roll visualization</div>
            <div class="roll-hint">Scroll the right roll panel horizontally for long sequences; the left header remains fixed.</div>
          </div>
          <div class="roll-actions" aria-label="Piano roll scroll controls" data-roll-actions>
            <button type="button" data-roll-action="start">Start</button>
            <button type="button" data-roll-action="center">Center</button>
            <button type="button" data-roll-action="end">End</button>
          </div>
        </div>

        <div class="piano-roll-wrap" data-roll-wrap>
          <div class="piano-roll-frame" role="group" aria-label="Piano roll for ${sample.title}" data-roll-frame>
            <div class="roll-header" data-image-box>
              <img src="${headerSrc}" alt="Piano-roll header for ${sample.title}" loading="lazy" decoding="async" />
            </div>
            <div class="roll-scroller" tabindex="0" data-roll-scroller aria-label="Scrollable piano-roll body for ${sample.title}">
              <img src="${rollSrc}" alt="Piano-roll body for ${sample.title}" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Audio comparison">
        <div class="section-label">Audio comparison</div>
        <div class="audio-grid">
          ${AUDIO_TRACKS.map((track) => renderAudioCard(sample, track)).join("")}
        </div>
      </section>
    </article>
  `;
}

function renderSamples() {
  const root = document.querySelector("#samples");
  root.innerHTML = SAMPLES.map(renderSample).join("");
}

function whenImageReady(img) {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

function updateRollLayout(frame) {
  const wrap = frame.closest("[data-roll-wrap]");
  const header = frame.querySelector(".roll-header");
  const scroller = frame.querySelector("[data-roll-scroller]");
  const rollImg = scroller?.querySelector("img");
  const actions = frame.closest(".roll-panel")?.querySelector("[data-roll-actions]");
  if (!wrap || !header || !scroller || !rollImg) return;

  frame.classList.remove("is-compact", "is-scrollable");
  if (actions) actions.hidden = false;

  const availableWidth = wrap.clientWidth;
  const headerWidth = header.getBoundingClientRect().width;
  const rollWidth = rollImg.getBoundingClientRect().width;
  const totalRenderedWidth = headerWidth + rollWidth;
  const shouldCompact = totalRenderedWidth <= availableWidth + 1;

  frame.classList.toggle("is-compact", shouldCompact);
  frame.classList.toggle("is-scrollable", !shouldCompact);
  if (actions) actions.hidden = shouldCompact;

  if (shouldCompact) {
    scroller.scrollLeft = 0;
  }
}

function installRollSizing() {
  const frames = Array.from(document.querySelectorAll("[data-roll-frame]"));

  frames.forEach(async (frame) => {
    const images = Array.from(frame.querySelectorAll("img"));
    await Promise.all(images.map(whenImageReady));
    updateRollLayout(frame);
  });

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const frame = entry.target.querySelector("[data-roll-frame]");
      if (frame) updateRollLayout(frame);
    });
  });

  document.querySelectorAll("[data-roll-wrap]").forEach((wrap) => {
    resizeObserver.observe(wrap);
  });
}

function installRollControls() {
  document.querySelectorAll(".sample-card").forEach((card) => {
    const scroller = card.querySelector("[data-roll-scroller]");
    card.querySelectorAll("[data-roll-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.rollAction;
        const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
        const left = action === "start" ? 0 : action === "center" ? maxLeft / 2 : maxLeft;
        scroller.scrollTo({ left, behavior: "smooth" });
      });
    });
  });
}

function installDragToScroll() {
  document.querySelectorAll("[data-roll-scroller]").forEach((scroller) => {
    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    scroller.addEventListener("pointerdown", (event) => {
      if (scroller.scrollWidth <= scroller.clientWidth) return;
      isDown = true;
      startX = event.clientX;
      startLeft = scroller.scrollLeft;
      scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      event.preventDefault();
      scroller.scrollLeft = startLeft - (event.clientX - startX);
    });

    scroller.addEventListener("pointerup", () => {
      isDown = false;
    });

    scroller.addEventListener("pointercancel", () => {
      isDown = false;
    });
  });
}

function installOneAudioAtATime() {
  const players = Array.from(document.querySelectorAll("audio"));
  players.forEach((player) => {
    player.addEventListener("play", () => {
      players.forEach((other) => {
        if (other !== player) other.pause();
      });
    });
  });
}

function installMissingAssetFallbacks() {
  document.querySelectorAll(".piano-roll-frame img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("is-missing");
      const fallback = document.createElement("div");
      fallback.className = "missing-asset";
      fallback.innerHTML = `Missing image:<br><code>${img.getAttribute("src")}</code>`;
      img.parentElement.appendChild(fallback);
    }, { once: true });
  });

  document.querySelectorAll("audio").forEach((audio) => {
    audio.addEventListener("error", () => {
      const note = audio.closest("[data-audio-card]")?.querySelector(".asset-note");
      if (note) note.hidden = false;
    }, { once: true });
  });
}

function init() {
  renderNav();
  renderSamples();
  installRollSizing();
  installRollControls();
  installDragToScroll();
  installOneAudioAtATime();
  installMissingAssetFallbacks();
}

init();
