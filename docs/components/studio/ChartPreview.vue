<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {generators} from "./data.js";
import {renderChart} from "./charts.js";

const props = defineProps({
  dataKey: {type: String, required: true},
  renderKey: {type: String, required: true},
  animate: {type: Boolean, default: false}
});

const root = ref(null);
let dispose = null;
let observer = null;
let lastSize = "";

function draw() {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  const size = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
  if (size === lastSize && dispose) return;
  lastSize = size;
  dispose?.();
  const data = generators[props.dataKey]();
  dispose = renderChart(props.renderKey, root.value, data, {animate: props.animate}) || (() => {});
}

onMounted(() => {
  draw();
  observer = new ResizeObserver(() => draw());
  observer.observe(root.value);
});

onUnmounted(() => {
  observer?.disconnect();
  dispose?.();
});
</script>

<template>
  <div ref="root" class="d3-studio-preview-root"></div>
</template>

<style scoped>
.d3-studio-preview-root {
  width: 100%;
  height: 100%;
}
</style>
