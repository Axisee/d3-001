export const CATEGORIES = [
  {id: "all", label: "All"},
  {id: "basic", label: "Basic"},
  {id: "advanced", label: "Advanced"},
  {id: "interactive", label: "Interactive"},
  {id: "geographic", label: "Geographic"}
];

export const PLAYGROUND_CHARTS = [
  {id: "bar", label: "Bar"},
  {id: "line", label: "Line"},
  {id: "pie", label: "Pie"},
  {id: "scatter", label: "Scatter"},
  {id: "area", label: "Area"},
  {id: "heatmap", label: "Heatmap"}
];

export const COLOR_SCHEMES = [
  {id: "category10", label: "Category 10"},
  {id: "tableau10", label: "Tableau 10"},
  {id: "viridis", label: "Viridis"},
  {id: "plasma", label: "Plasma"},
  {id: "inferno", label: "Inferno"},
  {id: "turbo", label: "Turbo"}
];

export const VISUALIZATIONS = [
  {
    id: "bar-chart",
    title: "Bar Chart",
    description: "Compare categorical values with animated rectangular marks.",
    category: "basic",
    tags: ["basic", "categorical", "comparison"],
    dataKey: "generateBarChartData",
    renderKey: "bar",
    snippet: `const data = generateBarChartData(8);
renderChart("bar", container, data);`
  },
  {
    id: "line-chart",
    title: "Line Chart",
    description: "Track multiple series across ordered categories.",
    category: "basic",
    tags: ["basic", "time-series", "trends"],
    dataKey: "generateLineChartData",
    renderKey: "line",
    snippet: `const data = generateLineChartData(12, 3);
renderChart("line", container, data);`
  },
  {
    id: "pie-chart",
    title: "Pie Chart",
    description: "Show parts of a whole with labeled slices.",
    category: "basic",
    tags: ["basic", "proportional"],
    dataKey: "generatePieChartData",
    renderKey: "pie",
    snippet: `const data = generatePieChartData(6);
renderChart("pie", container, data);`
  },
  {
    id: "donut-chart",
    title: "Donut Chart",
    description: "A pie variant with an inner radius for a total label.",
    category: "basic",
    tags: ["basic", "proportional"],
    dataKey: "generatePieChartData",
    renderKey: "donut",
    snippet: `const data = generatePieChartData(6);
renderChart("donut", container, data);`
  },
  {
    id: "scatter-plot",
    title: "Scatter Plot",
    description: "Plot two quantitative variables to inspect correlation.",
    category: "basic",
    tags: ["basic", "correlation"],
    dataKey: "generateScatterPlotData",
    renderKey: "scatter",
    snippet: `const data = generateScatterPlotData(80);
renderChart("scatter", container, data);`
  },
  {
    id: "area-chart",
    title: "Area Chart",
    description: "Stack series to show cumulative change over time.",
    category: "basic",
    tags: ["basic", "time-series"],
    dataKey: "generateAreaChartData",
    renderKey: "area",
    snippet: `const data = generateAreaChartData(20, 2);
renderChart("area", container, data);`
  },
  {
    id: "heatmap",
    title: "Heatmap",
    description: "Encode a matrix of values with a sequential color scale.",
    category: "advanced",
    tags: ["advanced", "matrix"],
    dataKey: "generateHeatmapData",
    renderKey: "heatmap",
    snippet: `const data = generateHeatmapData(7, 24);
renderChart("heatmap", container, data);`
  },
  {
    id: "treemap",
    title: "Treemap",
    description: "Nest rectangles to represent hierarchical magnitudes.",
    category: "advanced",
    tags: ["advanced", "hierarchy"],
    dataKey: "generateTreemapData",
    renderKey: "treemap",
    snippet: `const data = generateTreemapData(3, 4);
renderChart("treemap", container, data);`
  },
  {
    id: "box-plot",
    title: "Box Plot",
    description: "Summarize distributions with quartiles and outliers.",
    category: "advanced",
    tags: ["advanced", "distribution"],
    dataKey: "generateBoxPlotData",
    renderKey: "box",
    snippet: `const data = generateBoxPlotData(5);
renderChart("box", container, data);`
  },
  {
    id: "chord",
    title: "Chord Diagram",
    description: "Show bidirectional flows among a complete network.",
    category: "advanced",
    tags: ["advanced", "network", "flow"],
    dataKey: "generateChordData",
    renderKey: "chord",
    snippet: `const data = generateChordData(5);
renderChart("chord", container, data);`
  },
  {
    id: "streamgraph",
    title: "Streamgraph",
    description: "A displaced stacked area for evolving layered series.",
    category: "advanced",
    tags: ["advanced", "time-series", "stack"],
    dataKey: "generateStreamData",
    renderKey: "stream",
    snippet: `const data = generateStreamData(5, 40);
renderChart("stream", container, data);`
  },
  {
    id: "calendar",
    title: "Calendar Heatmap",
    description: "Map daily values onto a year of weeks.",
    category: "advanced",
    tags: ["advanced", "calendar", "time"],
    dataKey: "generateCalendarData",
    renderKey: "calendar",
    snippet: `const data = generateCalendarData(2023);
renderChart("calendar", container, data);`
  },
  {
    id: "force-layout",
    title: "Force-Directed Network",
    description: "Position a graph with charge, link, and drag forces.",
    category: "interactive",
    tags: ["interactive", "network", "force"],
    dataKey: "generateNetworkData",
    renderKey: "force",
    snippet: `const data = generateNetworkData(16, 24);
renderChart("force", container, data);`
  },
  {
    id: "bubble-chart",
    title: "Bubble Chart",
    description: "Pack sized circles with a collide force.",
    category: "interactive",
    tags: ["interactive", "force"],
    dataKey: "generateBubbleChartData",
    renderKey: "bubble",
    snippet: `const data = generateBubbleChartData(24);
renderChart("bubble", container, data);`
  },
  {
    id: "radar-chart",
    title: "Radar Chart",
    description: "Compare multivariate profiles on a radial axis.",
    category: "interactive",
    tags: ["interactive", "radial"],
    dataKey: "generateRadarChartData",
    renderKey: "radar",
    snippet: `const data = generateRadarChartData(6, 3);
renderChart("radar", container, data);`
  },
  {
    id: "geo-points",
    title: "Geographic Points",
    description: "Project lat/lng values with a spherical equal-earth map.",
    category: "geographic",
    tags: ["geographic", "projection"],
    dataKey: "generateGeoData",
    renderKey: "geo",
    snippet: `const data = generateGeoData();
renderChart("geo", container, data);`
  }
];

export function filterVisualizations(visualizations, {category = "all", query = ""} = {}) {
  const needle = query.trim().toLowerCase();
  return visualizations.filter((viz) => {
    const matchesCategory = category === "all" || viz.category === category;
    const haystack = `${viz.title} ${viz.description} ${viz.tags.join(" ")}`.toLowerCase();
    return matchesCategory && (!needle || haystack.includes(needle));
  });
}

export function getVisualization(id) {
  return VISUALIZATIONS.find((viz) => viz.id === id) ?? null;
}
