const CATEGORY_NAMES = {
  countries: ["USA", "China", "Japan", "Germany", "UK", "France", "India", "Italy", "Brazil", "Canada", "Russia", "South Korea", "Australia", "Spain", "Mexico"],
  companies: ["Apple", "Microsoft", "Amazon", "Google", "Meta", "Tesla", "Netflix", "Adobe", "Salesforce", "Oracle", "IBM", "Intel", "Cisco", "PayPal", "Uber"],
  products: ["Product A", "Product B", "Product C", "Product D", "Product E", "Product F", "Product G", "Product H", "Product I", "Product J"],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  quarters: ["Q1", "Q2", "Q3", "Q4"],
  categories: ["Category A", "Category B", "Category C", "Category D", "Category E"],
  cities: ["New York", "Los Angeles", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Toronto", "Dubai", "Singapore"],
  generic: ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima"]
};

export const PALETTE = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

export function randomNormal(mean = 0, stdDev = 1, random = Math.random) {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generateNames(count, type = "generic") {
  assert(Number.isFinite(count) && count >= 0, "count must be a non-negative number");
  const source = CATEGORY_NAMES[type] || CATEGORY_NAMES.generic;
  if (count <= source.length) return source.slice(0, count);
  return Array.from({length: count}, (_, i) => `${source[i % source.length]} ${Math.floor(i / source.length) + 1}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function generateBarChartData(count = 8) {
  const categories = generateNames(count, "products");
  return categories.map((name, i) => ({
    name,
    value: Math.floor(Math.random() * 100) + 20,
    color: PALETTE[i % PALETTE.length]
  }));
}

export function generateLineChartData(points = 12, series = 3) {
  const months = generateNames(Math.min(points, 12), "months");
  const seriesNames = generateNames(series, "generic");
  return Array.from({length: series}, (_, i) => ({
    name: seriesNames[i],
    color: PALETTE[i % PALETTE.length],
    data: months.map((month) => ({
      x: month,
      y: Math.max(0, Math.floor(randomNormal(50, 15)) + i * 10)
    }))
  }));
}

export function generatePieChartData(count = 6) {
  const categories = generateNames(count, "categories");
  const values = categories.map(() => Math.random() * 100 + 10);
  const total = values.reduce((sum, value) => sum + value, 0);
  return categories.map((name, i) => ({
    name,
    value: values[i],
    percentage: Number((values[i] / total * 100).toFixed(1)),
    color: PALETTE[i % PALETTE.length]
  }));
}

export function generateScatterPlotData(count = 80) {
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: randomNormal(50, 20),
    y: randomNormal(50, 20),
    size: Math.random() * 20 + 5,
    category: Math.floor(Math.random() * 4),
    color: PALETTE[Math.floor(Math.random() * 4)]
  }));
}

export function generateBubbleChartData(count = 24) {
  const countries = generateNames(count, "countries");
  return countries.map((name, i) => ({
    name,
    x: Math.random() * 100 + 10,
    y: Math.random() * 90 + 50,
    size: Math.random() * 1000 + 100,
    color: PALETTE[i % PALETTE.length]
  }));
}

export function generateAreaChartData(points = 20, series = 2) {
  const dates = Array.from({length: points}, (_, i) => {
    const date = new Date(Date.UTC(2023, 0, 1 + i * 15));
    return date.toISOString().slice(0, 10);
  });
  return Array.from({length: series}, (_, i) => ({
    name: `Dataset ${i + 1}`,
    color: PALETTE[i % PALETTE.length],
    data: dates.map((date, j) => ({
      date,
      value: Math.max(0, randomNormal(30, 10) + Math.sin(j * 0.5) * 20)
    }))
  }));
}

export function generateHeatmapData(rows = 7, cols = 24) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({length: cols}, (_, i) => `${String(i).padStart(2, "0")}:00`);
  return days.slice(0, rows).flatMap((day, dayIndex) =>
    hours.map((hour, hourIndex) => ({
      day,
      hour,
      value: Math.floor(Math.random() * 100),
      dayIndex,
      hourIndex
    }))
  );
}

export function generateTreemapData(depth = 3, maxChildren = 4) {
  assert(depth >= 1, "depth must be at least 1");
  const generateNode = (level, name) => {
    if (level <= 1) {
      return {
        name,
        value: Math.floor(Math.random() * 100) + 10,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      };
    }
    const childCount = Math.floor(Math.random() * maxChildren) + 2;
    return {
      name,
      children: Array.from({length: childCount}, (_, i) => generateNode(level - 1, `${name}.${i + 1}`))
    };
  };
  return generateNode(depth, "Root");
}

export function generateNetworkData(nodeCount = 16, linkCount = 24) {
  assert(nodeCount >= 2, "nodeCount must be at least 2");
  const nodes = Array.from({length: nodeCount}, (_, i) => ({
    id: i,
    name: `Node ${i}`,
    group: Math.floor(Math.random() * 4),
    value: Math.random() * 12 + 6,
    color: PALETTE[Math.floor(Math.random() * 4)]
  }));
  const links = [];
  const seen = new Set();
  let attempts = 0;
  while (links.length < linkCount && attempts < linkCount * 8) {
    attempts += 1;
    const source = Math.floor(Math.random() * nodeCount);
    let target = Math.floor(Math.random() * nodeCount);
    if (target === source) target = (target + 1) % nodeCount;
    const key = source < target ? `${source}-${target}` : `${target}-${source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({source, target, value: Math.random() * 10 + 1});
  }
  return {nodes, links};
}

export function generateGeoData() {
  return [
    {name: "United States", code: "US", lat: 39.8283, lng: -98.5795, value: 331},
    {name: "China", code: "CN", lat: 35.8617, lng: 104.1954, value: 1412},
    {name: "Japan", code: "JP", lat: 36.2048, lng: 138.2529, value: 125},
    {name: "Germany", code: "DE", lat: 51.1657, lng: 10.4515, value: 83},
    {name: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.436, value: 67},
    {name: "France", code: "FR", lat: 46.6034, lng: 1.8883, value: 68},
    {name: "India", code: "IN", lat: 20.5937, lng: 78.9629, value: 1408},
    {name: "Brazil", code: "BR", lat: -14.235, lng: -51.9253, value: 214},
    {name: "Canada", code: "CA", lat: 56.1304, lng: -106.3468, value: 38},
    {name: "Australia", code: "AU", lat: -25.2744, lng: 133.7751, value: 26}
  ].map((row, i) => ({...row, color: PALETTE[i % PALETTE.length]}));
}

export function generateBoxPlotData(categories = 5) {
  const categoryNames = generateNames(categories, "categories");
  return categoryNames.map((name, i) => {
    const values = Array.from({length: 100}, () => randomNormal(50 + i * 5, 10)).sort((a, b) => a - b);
    return {
      category: name,
      min: values[0],
      q1: values[24],
      median: values[49],
      q3: values[74],
      max: values[99],
      outliers: values.filter((_, idx) => idx < 5 || idx > 94).slice(0, 8),
      color: PALETTE[i % PALETTE.length]
    };
  });
}

export function generateRadarChartData(axes = 6, series = 3) {
  const axisNames = ["Speed", "Strength", "Intelligence", "Endurance", "Agility", "Charisma"].slice(0, axes);
  const seriesNames = generateNames(series, "generic");
  return {
    axes: axisNames,
    series: seriesNames.map((name, i) => ({
      name,
      values: Array.from({length: axes}, () => Math.floor(Math.random() * 80) + 20),
      color: PALETTE[i % PALETTE.length]
    }))
  };
}

export function generateCalendarData(year = 2023) {
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));
  const data = [];
  for (let stamp = startDate.getTime(); stamp <= endDate.getTime(); stamp += 86400000) {
    const date = new Date(stamp);
    data.push({
      date,
      value: Math.floor(Math.random() * 20),
      day: date.getUTCDay(),
      week: Math.floor((stamp - startDate.getTime()) / (7 * 86400000))
    });
  }
  return data;
}

export function generateChordData(size = 5) {
  const names = generateNames(size, "categories");
  const matrix = Array.from({length: size}, () =>
    Array.from({length: size}, () => Math.floor(Math.random() * 80) + 5)
  );
  for (let i = 0; i < size; i++) {
    matrix[i][i] = 0;
    for (let j = i + 1; j < size; j++) {
      matrix[j][i] = matrix[i][j];
    }
  }
  return {names, matrix, colors: PALETTE.slice(0, size)};
}

export function generateStreamData(layers = 5, points = 40) {
  const dates = Array.from({length: points}, (_, i) => new Date(Date.UTC(2023, 0, 1 + i * 7)));
  return Array.from({length: layers}, (_, i) => ({
    name: `Layer ${i + 1}`,
    color: PALETTE[i % PALETTE.length],
    data: dates.map((date, j) => ({
      date,
      value: Math.max(0.5, randomNormal(18, 8) + Math.sin(j * 0.2 + i) * 12)
    }))
  }));
}

export const sampleDatasets = {
  sales: {
    name: "Monthly Sales",
    description: "Product sales, revenue, and region by month",
    data: [
      {month: "Jan", product: "Laptops", sales: 120, revenue: 144000, region: "North"},
      {month: "Jan", product: "Phones", sales: 200, revenue: 120000, region: "North"},
      {month: "Jan", product: "Tablets", sales: 80, revenue: 40000, region: "North"},
      {month: "Feb", product: "Laptops", sales: 135, revenue: 162000, region: "North"},
      {month: "Feb", product: "Phones", sales: 180, revenue: 108000, region: "North"},
      {month: "Feb", product: "Tablets", sales: 95, revenue: 47500, region: "North"},
      {month: "Mar", product: "Laptops", sales: 150, revenue: 180000, region: "North"},
      {month: "Mar", product: "Phones", sales: 220, revenue: 132000, region: "North"},
      {month: "Mar", product: "Tablets", sales: 110, revenue: 55000, region: "North"},
      {month: "Apr", product: "Laptops", sales: 140, revenue: 168000, region: "South"},
      {month: "Apr", product: "Phones", sales: 240, revenue: 144000, region: "South"},
      {month: "Apr", product: "Tablets", sales: 125, revenue: 62500, region: "South"},
      {month: "May", product: "Laptops", sales: 165, revenue: 198000, region: "South"},
      {month: "May", product: "Phones", sales: 210, revenue: 126000, region: "South"},
      {month: "May", product: "Tablets", sales: 140, revenue: 70000, region: "South"},
      {month: "Jun", product: "Laptops", sales: 175, revenue: 210000, region: "South"},
      {month: "Jun", product: "Phones", sales: 260, revenue: 156000, region: "South"},
      {month: "Jun", product: "Tablets", sales: 155, revenue: 77500, region: "South"}
    ]
  },
  weather: {
    name: "City Weather",
    description: "Temperature and precipitation for major cities",
    data: [
      {city: "New York", month: "Jan", temperature: 2, precipitation: 84, humidity: 65},
      {city: "New York", month: "Feb", temperature: 4, precipitation: 76, humidity: 63},
      {city: "New York", month: "Mar", temperature: 9, precipitation: 91, humidity: 64},
      {city: "New York", month: "Apr", temperature: 15, precipitation: 99, humidity: 66},
      {city: "Los Angeles", month: "Jan", temperature: 15, precipitation: 79, humidity: 68},
      {city: "Los Angeles", month: "Feb", temperature: 16, precipitation: 76, humidity: 70},
      {city: "Los Angeles", month: "Mar", temperature: 17, precipitation: 65, humidity: 72},
      {city: "Los Angeles", month: "Apr", temperature: 19, precipitation: 24, humidity: 70},
      {city: "Chicago", month: "Jan", temperature: -4, precipitation: 51, humidity: 74},
      {city: "Chicago", month: "Feb", temperature: -1, precipitation: 48, humidity: 73},
      {city: "Chicago", month: "Mar", temperature: 6, precipitation: 65, humidity: 71},
      {city: "Chicago", month: "Apr", temperature: 12, precipitation: 91, humidity: 68}
    ]
  },
  stocks: {
    name: "Tech Stocks",
    description: "Daily prices for selected technology companies",
    data: [
      {date: "2024-01-01", company: "AAPL", price: 185.92, volume: 52465200, sector: "Technology"},
      {date: "2024-01-02", company: "AAPL", price: 187.15, volume: 54012300, sector: "Technology"},
      {date: "2024-01-03", company: "AAPL", price: 184.25, volume: 48921100, sector: "Technology"},
      {date: "2024-01-04", company: "AAPL", price: 186.78, volume: 51234600, sector: "Technology"},
      {date: "2024-01-05", company: "AAPL", price: 189.42, volume: 55678900, sector: "Technology"},
      {date: "2024-01-01", company: "GOOGL", price: 142.65, volume: 28765400, sector: "Technology"},
      {date: "2024-01-02", company: "GOOGL", price: 144.12, volume: 29876500, sector: "Technology"},
      {date: "2024-01-03", company: "GOOGL", price: 141.89, volume: 27654300, sector: "Technology"},
      {date: "2024-01-04", company: "GOOGL", price: 143.56, volume: 30123400, sector: "Technology"},
      {date: "2024-01-05", company: "GOOGL", price: 145.78, volume: 31245600, sector: "Technology"},
      {date: "2024-01-01", company: "MSFT", price: 376.04, volume: 23456700, sector: "Technology"},
      {date: "2024-01-02", company: "MSFT", price: 378.92, volume: 24567800, sector: "Technology"},
      {date: "2024-01-03", company: "MSFT", price: 374.58, volume: 22345600, sector: "Technology"},
      {date: "2024-01-04", company: "MSFT", price: 377.33, volume: 25678900, sector: "Technology"},
      {date: "2024-01-05", company: "MSFT", price: 380.15, volume: 26789000, sector: "Technology"}
    ]
  },
  energy: {
    name: "Energy Mix",
    description: "Energy consumption by source and country",
    data: [
      {country: "USA", source: "Coal", consumption: 1245, renewable: false},
      {country: "USA", source: "Natural Gas", consumption: 1678, renewable: false},
      {country: "USA", source: "Nuclear", consumption: 843, renewable: false},
      {country: "USA", source: "Hydro", consumption: 254, renewable: true},
      {country: "USA", source: "Wind", consumption: 387, renewable: true},
      {country: "USA", source: "Solar", consumption: 156, renewable: true},
      {country: "China", source: "Coal", consumption: 3856, renewable: false},
      {country: "China", source: "Natural Gas", consumption: 456, renewable: false},
      {country: "China", source: "Nuclear", consumption: 287, renewable: false},
      {country: "China", source: "Hydro", consumption: 1398, renewable: true},
      {country: "China", source: "Wind", consumption: 465, renewable: true},
      {country: "China", source: "Solar", consumption: 287, renewable: true},
      {country: "Germany", source: "Coal", consumption: 198, renewable: false},
      {country: "Germany", source: "Natural Gas", consumption: 287, renewable: false},
      {country: "Germany", source: "Nuclear", consumption: 76, renewable: false},
      {country: "Germany", source: "Hydro", consumption: 28, renewable: true},
      {country: "Germany", source: "Wind", consumption: 154, renewable: true},
      {country: "Germany", source: "Solar", consumption: 67, renewable: true}
    ]
  }
};

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i
];

export function isDateLike(value) {
  return typeof value === "string" && DATE_PATTERNS.some((pattern) => pattern.test(value));
}

export function getColumnType(data, column) {
  assert(Array.isArray(data) && data.length > 0, "data must be a non-empty array");
  const sample = data.find((row) => row && row[column] != null)?.[column];
  if (typeof sample === "number" && Number.isFinite(sample)) return "numeric";
  if (typeof sample === "boolean") return "boolean";
  if (isDateLike(sample)) return "date";
  return "categorical";
}

export function getColumns(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return Object.keys(data[0]).map((name) => ({
    name,
    type: getColumnType(data, name),
    values: [...new Set(data.map((row) => row[name]))].slice(0, 8)
  }));
}

export function getSuggestedCharts(xColumn, yColumn, data) {
  if (!xColumn || !yColumn || !data?.length) return [];
  const xType = getColumnType(data, xColumn);
  const yType = getColumnType(data, yColumn);
  const suggestions = [];
  if ((xType === "categorical" || xType === "date") && yType === "numeric") suggestions.push("bar");
  if (xType === "categorical" && yType === "numeric") suggestions.push("pie");
  if ((xType === "date" || xType === "numeric") && yType === "numeric") suggestions.push("line", "area", "scatter");
  if (xType === "numeric" && yType === "numeric") suggestions.push("scatter", "heatmap");
  if (xType === "categorical" && yType === "categorical") suggestions.push("heatmap");
  return [...new Set(suggestions)];
}

export function parseCsv(text) {
  assert(typeof text === "string" && text.trim(), "CSV text is required");
  const rows = [];
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.length);
  assert(lines.length >= 2, "CSV must include a header and at least one row");
  const headers = splitCsvLine(lines[0]);
  assert(headers.length > 0 && headers.every(Boolean), "CSV headers cannot be empty");
  for (const line of lines.slice(1)) {
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = coerceValue(values[index] ?? "");
    });
    rows.push(row);
  }
  return rows;
}

export function splitCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

export function coerceValue(value) {
  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  const number = Number(value);
  return Number.isFinite(number) && value.trim() !== "" ? number : value;
}

export function parseJsonTable(value) {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (Array.isArray(parsed)) {
    assert(parsed.every((row) => row && typeof row === "object"), "JSON must be an array of objects");
    return parsed;
  }
  if (parsed && typeof parsed === "object") {
    const nested = Object.values(parsed).find((entry) => Array.isArray(entry) && entry.length && typeof entry[0] === "object");
    if (nested) return nested;
  }
  throw new Error("JSON must be an array of objects");
}

export function isSafeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function aggregateNumericByKey(rows, keyColumn, valueColumn) {
  const totals = new Map();
  for (const row of rows) {
    const key = row[keyColumn];
    const value = Number(row[valueColumn]);
    if (!Number.isFinite(value)) continue;
    totals.set(key, (totals.get(key) || 0) + value);
  }
  return [...totals.entries()].map(([name, value], i) => ({
    name,
    value,
    color: PALETTE[i % PALETTE.length]
  }));
}

export const generators = {
  generateBarChartData,
  generateLineChartData,
  generatePieChartData,
  generateScatterPlotData,
  generateBubbleChartData,
  generateAreaChartData,
  generateHeatmapData,
  generateTreemapData,
  generateNetworkData,
  generateGeoData,
  generateBoxPlotData,
  generateRadarChartData,
  generateCalendarData,
  generateChordData,
  generateStreamData
};
