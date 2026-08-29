<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {CATEGORIES, COLOR_SCHEMES, PLAYGROUND_CHARTS, VISUALIZATIONS, filterVisualizations} from "./catalog.js";
import {
  getColumns,
  getSuggestedCharts,
  isSafeHttpUrl,
  parseCsv,
  parseJsonTable,
  sampleDatasets
} from "./data.js";
import {renderPlaygroundChart, serializeSvg} from "./charts.js";
import ChartPreview from "./ChartPreview.vue";
import "./studio.css";

const mode = ref("gallery");
const category = ref("all");
const query = ref("");
const selected = ref(null);

const source = ref("sample");
const datasetKey = ref("sales");
const rows = ref(sampleDatasets.sales.data);
const datasetLabel = ref(sampleDatasets.sales.name);
const chartType = ref("bar");
const xColumn = ref("month");
const yColumn = ref("sales");
const colorScheme = ref("category10");
const apiUrl = ref("");
const errorMessage = ref("");
const playgroundChart = ref(null);
let playgroundDispose = null;
const fileInput = ref(null);

const filtered = computed(() => filterVisualizations(VISUALIZATIONS, {
  category: category.value,
  query: query.value
}));

const columns = computed(() => getColumns(rows.value));
const suggestions = computed(() => getSuggestedCharts(xColumn.value, yColumn.value, rows.value));

function openModal(viz) {
  selected.value = viz;
}

function closeModal() {
  selected.value = null;
}

function onKeydown(event) {
  if (event.key === "Escape") closeModal();
}

function renderPlayground() {
  playgroundDispose?.();
  playgroundDispose = null;
  errorMessage.value = "";
  if (!playgroundChart.value || !rows.value.length || !xColumn.value || !yColumn.value) return;
  try {
    playgroundDispose = renderPlaygroundChart(chartType.value, playgroundChart.value, rows.value, {
      xColumn: xColumn.value,
      yColumn: yColumn.value,
      scheme: colorScheme.value,
      animate: false
    }) || (() => {});
  } catch (error) {
    errorMessage.value = error.message;
  }
}

function applyDataset(key) {
  const dataset = sampleDatasets[key];
  datasetKey.value = key;
  rows.value = dataset.data;
  datasetLabel.value = dataset.name;
  source.value = "sample";
  inferAxes();
}

function inferAxes() {
  const nextColumns = getColumns(rows.value);
  const categorical = nextColumns.find((column) => column.type === "categorical" || column.type === "date");
  const numeric = nextColumns.find((column) => column.type === "numeric");
  xColumn.value = categorical?.name || nextColumns[0]?.name || "";
  yColumn.value = numeric?.name || nextColumns[1]?.name || nextColumns[0]?.name || "";
  const next = getSuggestedCharts(xColumn.value, yColumn.value, rows.value);
  if (next.length && !next.includes(chartType.value)) chartType.value = next[0];
}

function selectSource(next) {
  source.value = next;
  errorMessage.value = "";
  if (next === "sample") applyDataset(datasetKey.value);
}

async function onFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    rows.value = file.name.endsWith(".json") ? parseJsonTable(text) : parseCsv(text);
    datasetLabel.value = file.name;
    inferAxes();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    event.target.value = "";
  }
}

async function fetchApi() {
  if (!isSafeHttpUrl(apiUrl.value)) {
    errorMessage.value = "Enter an http(s) URL that returns a JSON table.";
    return;
  }
  try {
    const response = await fetch(apiUrl.value);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    rows.value = parseJsonTable(await response.json());
    datasetLabel.value = apiUrl.value;
    inferAxes();
  } catch (error) {
    errorMessage.value = error.message;
  }
}

function exportSvg() {
  const svg = playgroundChart.value?.querySelector("svg");
  if (!svg) return;
  const blob = new Blob([serializeSvg(svg)], {type: "image/svg+xml"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${datasetLabel.value || "chart"}.svg`;
  link.click();
  URL.revokeObjectURL(url);
}

watch([mode, chartType, xColumn, yColumn, colorScheme, rows], async () => {
  if (mode.value === "playground") {
    await nextTick();
    renderPlayground();
  }
});

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  inferAxes();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  playgroundDispose?.();
});
</script>

<template>
  <div class="d3-studio">
    <header class="d3-studio-header">
      <div>
        <h2>D3 Visualization Studio</h2>
        <p>Browse gallery examples or plot your own table with the bundled D3 modules.</p>
      </div>
      <div class="d3-studio-tabs" role="tablist">
        <button type="button" :class="{active: mode === 'gallery'}" @click="mode = 'gallery'">Gallery</button>
        <button type="button" :class="{active: mode === 'playground'}" @click="mode = 'playground'">Playground</button>
      </div>
    </header>

    <template v-if="mode === 'gallery'">
      <div class="d3-studio-toolbar">
        <input v-model="query" class="d3-studio-search" type="search" placeholder="Search charts, tags, or descriptions">
        <div class="d3-studio-chips">
          <button
            v-for="item in CATEGORIES"
            :key="item.id"
            type="button"
            class="d3-studio-chip"
            :class="{active: category === item.id}"
            @click="category = item.id"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      <div v-if="filtered.length" class="d3-studio-grid">
        <button
          v-for="viz in filtered"
          :key="viz.id"
          type="button"
          class="d3-studio-card"
          @click="openModal(viz)"
        >
          <div class="d3-studio-card-head">
            <strong>{{ viz.title }}</strong>
            <span class="d3-studio-badge">{{ viz.category }}</span>
          </div>
          <div class="d3-studio-preview">
            <ChartPreview :data-key="viz.dataKey" :render-key="viz.renderKey" />
          </div>
          <p>{{ viz.description }}</p>
        </button>
      </div>
      <div v-else class="d3-studio-empty">No visualizations match that filter.</div>
    </template>

    <div v-else class="d3-studio-body">
      <aside class="d3-studio-sidebar">
        <section>
          <h3>Data source</h3>
          <div class="d3-studio-option-list">
            <button type="button" class="d3-studio-chip" :class="{active: source === 'sample'}" @click="selectSource('sample')">Sample data</button>
            <button type="button" class="d3-studio-chip" :class="{active: source === 'file'}" @click="selectSource('file')">Upload CSV / JSON</button>
            <button type="button" class="d3-studio-chip" :class="{active: source === 'api'}" @click="selectSource('api')">API JSON</button>
          </div>
        </section>

        <section v-if="source === 'sample'">
          <h3>Dataset</h3>
          <div class="d3-studio-field">
            <label for="studio-dataset">Sample table</label>
            <select id="studio-dataset" :value="datasetKey" @change="applyDataset($event.target.value)">
              <option v-for="(dataset, key) in sampleDatasets" :key="key" :value="key">{{ dataset.name }}</option>
            </select>
          </div>
        </section>

        <section v-if="source === 'file'">
          <h3>File</h3>
          <input ref="fileInput" class="d3-studio-hidden-file" type="file" accept=".csv,.json,text/csv,application/json" @change="onFile">
          <button type="button" class="d3-studio-button primary" @click="fileInput?.click()">Choose file</button>
        </section>

        <section v-if="source === 'api'">
          <h3>Endpoint</h3>
          <div class="d3-studio-field">
            <label for="studio-api">JSON URL</label>
            <input id="studio-api" v-model="apiUrl" type="url" placeholder="https://example.com/data.json">
          </div>
          <button type="button" class="d3-studio-button primary" @click="fetchApi">Fetch</button>
        </section>

        <section>
          <h3>Chart</h3>
          <div class="d3-studio-option-list">
            <button
              v-for="item in PLAYGROUND_CHARTS"
              :key="item.id"
              type="button"
              class="d3-studio-chip"
              :class="{active: chartType === item.id}"
              @click="chartType = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </section>

        <section>
          <h3>Encoding</h3>
          <div class="d3-studio-field">
            <label for="studio-x">X / category</label>
            <select id="studio-x" v-model="xColumn">
              <option v-for="column in columns" :key="column.name" :value="column.name">{{ column.name }} ({{ column.type }})</option>
            </select>
          </div>
          <div class="d3-studio-field">
            <label for="studio-y">Y / value</label>
            <select id="studio-y" v-model="yColumn">
              <option v-for="column in columns" :key="column.name" :value="column.name">{{ column.name }} ({{ column.type }})</option>
            </select>
          </div>
          <div class="d3-studio-field">
            <label for="studio-color">Color scheme</label>
            <select id="studio-color" v-model="colorScheme">
              <option v-for="scheme in COLOR_SCHEMES" :key="scheme.id" :value="scheme.id">{{ scheme.label }}</option>
            </select>
          </div>
        </section>
      </aside>

      <section class="d3-studio-main">
        <div class="d3-studio-meta">
          <div>
            <strong>{{ datasetLabel }}</strong>
            <div class="d3-studio-badge">{{ rows.length }} rows · suggested {{ suggestions.join(", ") || "none" }}</div>
          </div>
          <button type="button" class="d3-studio-button" @click="exportSvg">Export SVG</button>
        </div>
        <p v-if="errorMessage" class="d3-studio-error">{{ errorMessage }}</p>
        <div ref="playgroundChart" class="d3-studio-chart-shell"></div>
        <div class="d3-studio-table-wrap">
          <table>
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.name">{{ column.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows.slice(0, 8)" :key="index">
                <td v-for="column in columns" :key="column.name">{{ row[column.name] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="selected" class="d3-studio-modal" @click.self="closeModal">
      <div class="d3-studio-modal-card" role="dialog" aria-modal="true" :aria-label="selected.title">
        <div class="d3-studio-modal-head">
          <div>
            <h3>{{ selected.title }}</h3>
            <p>{{ selected.description }}</p>
          </div>
          <button type="button" class="d3-studio-button" @click="closeModal">Close</button>
        </div>
        <div class="d3-studio-modal-chart">
          <ChartPreview :data-key="selected.dataKey" :render-key="selected.renderKey" :animate="true" />
        </div>
        <pre class="d3-studio-code"><code>{{ selected.snippet }}</code></pre>
      </div>
    </div>
  </div>
</template>
