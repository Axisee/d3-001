import assert from "assert";
import {
  aggregateNumericByKey,
  coerceValue,
  generateBarChartData,
  generateChordData,
  generateGeoData,
  generateNames,
  generateNetworkData,
  generators,
  getColumnType,
  getColumns,
  getSuggestedCharts,
  isDateLike,
  isSafeHttpUrl,
  parseCsv,
  parseJsonTable,
  sampleDatasets,
  splitCsvLine
} from "../docs/components/studio/data.js";
import {
  CATEGORIES,
  VISUALIZATIONS,
  filterVisualizations,
  getVisualization
} from "../docs/components/studio/catalog.js";
import {galleryRenderKeys, rowsToChartData} from "../docs/components/studio/charts.js";

it("generateNames falls back when the category is unknown", () => {
  const names = generateNames(3, "not-a-real-type");
  assert.deepStrictEqual(names, ["Alpha", "Bravo", "Charlie"]);
});

it("generateNames extends past the source list without throwing", () => {
  const names = generateNames(20, "quarters");
  assert.strictEqual(names.length, 20);
  assert.ok(names[4].includes("2"));
});

it("bar chart data has the requested length and required fields", () => {
  const data = generateBarChartData(5);
  assert.strictEqual(data.length, 5);
  for (const row of data) {
    assert.ok(row.name);
    assert.ok(Number.isFinite(row.value));
    assert.ok(row.color);
  }
});

it("network links only reference existing node ids", () => {
  const {nodes, links} = generateNetworkData(8, 10);
  const ids = new Set(nodes.map((node) => node.id));
  assert.ok(links.length > 0);
  for (const link of links) {
    assert.ok(ids.has(link.source));
    assert.ok(ids.has(link.target));
    assert.notStrictEqual(link.source, link.target);
  }
});

it("geo data includes coordinates for every country", () => {
  const data = generateGeoData();
  assert.ok(data.length >= 8);
  for (const row of data) {
    assert.ok(Number.isFinite(row.lat));
    assert.ok(Number.isFinite(row.lng));
    assert.ok(Number.isFinite(row.value));
  }
});

it("chord matrices are square, symmetric, and hollow on the diagonal", () => {
  const {names, matrix} = generateChordData(4);
  assert.strictEqual(names.length, 4);
  assert.strictEqual(matrix.length, 4);
  for (let i = 0; i < 4; i++) {
    assert.strictEqual(matrix[i].length, 4);
    assert.strictEqual(matrix[i][i], 0);
    for (let j = 0; j < 4; j++) {
      assert.strictEqual(matrix[i][j], matrix[j][i]);
    }
  }
});

it("every catalog visualization has a generator and renderer", () => {
  assert.ok(VISUALIZATIONS.length >= 12);
  assert.ok(CATEGORIES.some((item) => item.id === "geographic"));
  assert.ok(VISUALIZATIONS.some((item) => item.category === "geographic"));
  for (const viz of VISUALIZATIONS) {
    assert.ok(generators[viz.dataKey], `${viz.id} missing generator ${viz.dataKey}`);
    assert.ok(galleryRenderKeys.includes(viz.renderKey), `${viz.id} missing renderer ${viz.renderKey}`);
  }
});

it("filterVisualizations matches category and query", () => {
  const geographic = filterVisualizations(VISUALIZATIONS, {category: "geographic"});
  assert.ok(geographic.length > 0);
  assert.ok(geographic.every((item) => item.category === "geographic"));
  const search = filterVisualizations(VISUALIZATIONS, {query: "force"});
  assert.ok(search.some((item) => item.id === "force-layout"));
  assert.strictEqual(getVisualization("missing"), null);
  assert.strictEqual(getVisualization("bar-chart").renderKey, "bar");
});

it("parses quoted CSV fields that contain commas", () => {
  assert.deepStrictEqual(splitCsvLine("A,\"B, C\",D"), ["A", "B, C", "D"]);
  const rows = parseCsv("city,notes,value\n\"New York\",\"a, b\",12\nParis,ok,4");
  assert.strictEqual(rows.length, 2);
  assert.strictEqual(rows[0].city, "New York");
  assert.strictEqual(rows[0].notes, "a, b");
  assert.strictEqual(rows[0].value, 12);
});

it("coerces scalars and unwraps nested JSON tables", () => {
  assert.strictEqual(coerceValue("42"), 42);
  assert.strictEqual(coerceValue("true"), true);
  assert.strictEqual(coerceValue("north"), "north");
  const rows = parseJsonTable({meta: {}, records: [{a: 1}, {a: 2}]});
  assert.deepStrictEqual(rows, [{a: 1}, {a: 2}]);
  assert.throws(() => parseJsonTable({ok: true}), /array of objects/);
});

it("classifies columns and suggests chart types", () => {
  const data = sampleDatasets.sales.data;
  assert.strictEqual(getColumnType(data, "sales"), "numeric");
  assert.strictEqual(getColumnType(data, "month"), "date");
  assert.strictEqual(getColumnType(data, "product"), "categorical");
  assert.ok(isDateLike("2024-01-02"));
  const columns = getColumns(data);
  assert.ok(columns.some((column) => column.name === "revenue" && column.type === "numeric"));
  const suggestions = getSuggestedCharts("month", "sales", data);
  assert.ok(suggestions.includes("line"));
  assert.ok(suggestions.includes("bar"));
});

it("rejects unsafe API URLs", () => {
  assert.strictEqual(isSafeHttpUrl("https://example.com/data.json"), true);
  assert.strictEqual(isSafeHttpUrl("http://localhost:3000/table"), true);
  assert.strictEqual(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.strictEqual(isSafeHttpUrl("file:///etc/passwd"), false);
  assert.strictEqual(isSafeHttpUrl("not a url"), false);
});

it("aggregates numeric columns and prepares playground series", () => {
  const rows = sampleDatasets.sales.data;
  const bars = aggregateNumericByKey(rows, "product", "sales");
  const laptops = bars.find((row) => row.name === "Laptops");
  assert.ok(laptops.value > 0);
  const line = rowsToChartData("line", rows, "month", "sales");
  assert.strictEqual(line.length, 1);
  assert.ok(line[0].data.length >= 6);
  const scatter = rowsToChartData("scatter", rows, "sales", "revenue");
  assert.ok(scatter.every((row) => Number.isFinite(row.x) && Number.isFinite(row.y)));
});
