import {Runtime} from "@observablehq/runtime";

const GALLERY_URL = "https://api.observablehq.com/@d3/gallery.js?v=4";

async function importRemoteModule(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch error: ${response.status} ${url}`);
  const source = await response.text();
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`);
}

export default {
  async load() {
    try {
      const runtime = new Runtime();
      const module = runtime.module((await importRemoteModule(GALLERY_URL)).default);
      const data = [];
      module.define("md", () => String.raw);
      module.redefine("previews", () => (chunk) => data.push(...chunk));
      const values = [];
      for (const output of module._resolve("previews")._outputs) {
        if (output._name) {
          values.push(module.value(output._name));
        }
      }
      await Promise.all(values);
      return data;
    } catch (error) {
      if (process.env.CI) throw error;
      console.warn(`gallery examples unavailable: ${error.message}`);
      return [];
    }
  }
};
