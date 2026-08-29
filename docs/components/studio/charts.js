import * as d3 from "d3";
import {PALETTE, aggregateNumericByKey} from "./data.js";

const DEFAULT_MARGIN = {top: 20, right: 18, bottom: 36, left: 42};

function measure(container, fallbackWidth = 360, fallbackHeight = 220) {
  const rect = container.getBoundingClientRect();
  return {
    width: Math.max(Math.floor(rect.width) || fallbackWidth, 120),
    height: Math.max(Math.floor(rect.height) || fallbackHeight, 100)
  };
}

function createSvg(container, width, height) {
  d3.select(container).selectAll("svg.d3-studio-chart").remove();
  return d3.select(container)
    .append("svg")
    .attr("class", "d3-studio-chart")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img");
}

function ink() {
  return getComputedStyle(document.documentElement).getPropertyValue("--vp-c-text-2").trim() || "#64748b";
}

function createTooltipController() {
  const node = d3.select(document.body)
    .append("div")
    .attr("class", "d3-studio-tooltip")
    .style("opacity", 0);
  return {
    show(html, event) {
      node.html(html)
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY - 8}px`)
        .style("opacity", 1);
    },
    hide() {
      node.style("opacity", 0);
    },
    dispose() {
      node.remove();
    }
  };
}

function bindHover(selection, tooltip, htmlFor) {
  selection
    .on("pointerenter", (event, d) => tooltip.show(htmlFor(d), event))
    .on("pointermove", (event, d) => tooltip.show(htmlFor(d), event))
    .on("pointerleave", () => tooltip.hide());
}

function formatNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? d3.format(",.2~f")(value) : String(value);
}

export function renderBar(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = DEFAULT_MARGIN;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand().domain(data.map((d) => d.name)).range([0, innerWidth]).padding(0.18);
  const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) || 1]).nice().range([innerHeight, 0]);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  const tooltip = createTooltipController();
  const bars = g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", innerHeight)
    .attr("height", 0)
    .attr("rx", 3)
    .attr("fill", (d) => d.color || PALETTE[0]);
  bindHover(bars, tooltip, (d) => `${d.name}: ${formatNumber(d.value)}`);
  if (options.animate !== false) {
    bars.transition().duration(options.duration ?? 700).attr("y", (d) => y(d.value)).attr("height", (d) => innerHeight - y(d.value));
  } else {
    bars.attr("y", (d) => y(d.value)).attr("height", (d) => innerHeight - y(d.value));
  }
  return () => tooltip.dispose();
}

export function renderLine(container, series, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = DEFAULT_MARGIN;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const xDomain = series[0]?.data.map((d) => d.x) ?? [];
  const x = d3.scalePoint().domain(xDomain).range([0, innerWidth]);
  const y = d3.scaleLinear()
    .domain(d3.extent(series.flatMap((item) => item.data), (d) => d.y))
    .nice()
    .range([innerHeight, 0]);
  const line = d3.line().x((d) => x(d.x)).y((d) => y(d.y)).curve(d3.curveMonotoneX);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  const tooltip = createTooltipController();
  for (const item of series) {
    const path = g.append("path")
      .datum(item.data)
      .attr("fill", "none")
      .attr("stroke", item.color)
      .attr("stroke-width", 2)
      .attr("d", line);
    if (options.animate !== false && path.node()) {
      const length = path.node().getTotalLength();
      path.attr("stroke-dasharray", `${length} ${length}`)
        .attr("stroke-dashoffset", length)
        .transition()
        .duration(options.duration ?? 800)
        .attr("stroke-dashoffset", 0);
    }
    const dots = g.selectAll(null)
      .data(item.data)
      .join("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 3.5)
      .attr("fill", item.color);
    bindHover(dots, tooltip, (d) => `${item.name}<br>${d.x}: ${formatNumber(d.y)}`);
  }
  return () => tooltip.dispose();
}

function renderPolar(container, data, options, innerRatio) {
  const {width, height} = measure(container, options.width, options.height);
  const radius = Math.max(12, Math.min(width, height) / 2 - 8);
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  const pie = d3.pie().value((d) => d.value).sort(null);
  const arc = d3.arc().innerRadius(radius * innerRatio).outerRadius(radius);
  const tooltip = createTooltipController();
  const paths = g.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("fill", (d) => d.data.color || PALETTE[d.index % PALETTE.length]);
  bindHover(paths, tooltip, (d) => `${d.data.name}: ${formatNumber(d.data.percentage ?? d.data.value)}`);
  if (options.animate !== false) {
    paths.transition().duration(options.duration ?? 700).attrTween("d", function(d) {
      const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
      return (t) => arc(interpolate(t));
    });
  } else {
    paths.attr("d", arc);
  }
  if (innerRatio > 0) {
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "currentColor")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .text("Total");
  }
  return () => tooltip.dispose();
}

export function renderPie(container, data, options = {}) {
  return renderPolar(container, data, options, 0);
}

export function renderDonut(container, data, options = {}) {
  return renderPolar(container, data, options, 0.62);
}

export function renderScatter(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = DEFAULT_MARGIN;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleLinear().domain(d3.extent(data, (d) => d.x)).nice().range([0, innerWidth]);
  const y = d3.scaleLinear().domain(d3.extent(data, (d) => d.y)).nice().range([innerHeight, 0]);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  const tooltip = createTooltipController();
  const dots = g.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 0)
    .attr("fill", (d) => d.color || PALETTE[0])
    .attr("opacity", 0.75);
  bindHover(dots, tooltip, (d) => `x ${formatNumber(d.x)}<br>y ${formatNumber(d.y)}`);
  const targetRadius = (d) => Math.max(2.5, (d.size ?? 8) / 3);
  if (options.animate !== false) {
    dots.transition().duration(options.duration ?? 600).attr("r", targetRadius);
  } else {
    dots.attr("r", targetRadius);
  }
  return () => tooltip.dispose();
}

export function renderArea(container, series, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = DEFAULT_MARGIN;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const dates = series[0]?.data.map((d) => d.date) ?? [];
  const x = d3.scalePoint().domain(dates).range([0, innerWidth]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(series.flatMap((item) => item.data), (d) => d.value) || 1])
    .nice()
    .range([innerHeight, 0]);
  const area = d3.area().x((d) => x(d.date)).y0(innerHeight).y1((d) => y(d.value)).curve(d3.curveMonotoneX);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickValues(dates.filter((_, i) => i % 4 === 0)).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  const tooltip = createTooltipController();
  for (const item of series) {
    g.append("path")
      .datum(item.data)
      .attr("fill", item.color)
      .attr("opacity", 0.45)
      .attr("d", area);
    const dots = g.selectAll(null)
      .data(item.data)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 2.5)
      .attr("fill", item.color);
    bindHover(dots, tooltip, (d) => `${item.name}<br>${d.date}: ${formatNumber(d.value)}`);
  }
  return () => tooltip.dispose();
}

export function renderHeatmap(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = {top: 16, right: 12, bottom: 28, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const days = [...new Set(data.map((d) => d.day))];
  const hours = [...new Set(data.map((d) => d.hour))];
  const x = d3.scaleBand().domain(hours).range([0, innerWidth]).padding(0.05);
  const y = d3.scaleBand().domain(days).range([0, innerHeight]).padding(0.05);
  const color = d3.scaleSequential(d3.interpolateYlGnBu).domain(d3.extent(data, (d) => d.value));
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickValues(hours.filter((_, i) => i % 4 === 0)).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).tickSizeOuter(0));
  const tooltip = createTooltipController();
  const cells = g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.hour))
    .attr("y", (d) => y(d.day))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 2)
    .attr("fill", (d) => color(d.value));
  bindHover(cells, tooltip, (d) => `${d.day} ${d.hour}: ${formatNumber(d.value)}`);
  return () => tooltip.dispose();
}

export function renderTreemap(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const svg = createSvg(container, width, height);
  const root = d3.hierarchy(data).sum((d) => d.value || 0).sort((a, b) => b.value - a.value);
  d3.treemap().size([width, height]).padding(2)(root);
  const tooltip = createTooltipController();
  const cell = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);
  const rects = cell.append("rect")
    .attr("width", (d) => Math.max(0, d.x1 - d.x0))
    .attr("height", (d) => Math.max(0, d.y1 - d.y0))
    .attr("rx", 3)
    .attr("fill", (d) => d.data.color || PALETTE[0]);
  bindHover(rects, tooltip, (d) => `${d.data.name}: ${formatNumber(d.data.value)}`);
  cell.append("text")
    .attr("x", 4)
    .attr("y", 14)
    .attr("fill", "white")
    .style("font-size", "10px")
    .text((d) => (d.x1 - d.x0 > 36 ? d.data.name : ""));
  return () => tooltip.dispose();
}

export function renderBox(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = DEFAULT_MARGIN;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand().domain(data.map((d) => d.category)).range([0, innerWidth]).padding(0.35);
  const y = d3.scaleLinear()
    .domain([d3.min(data, (d) => Math.min(d.min, ...d.outliers)), d3.max(data, (d) => Math.max(d.max, ...d.outliers))])
    .nice()
    .range([innerHeight, 0]);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSizeOuter(0));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  const tooltip = createTooltipController();
  const groups = g.selectAll("g.box")
    .data(data)
    .join("g")
    .attr("class", "box")
    .attr("transform", (d) => `translate(${x(d.category)},0)`);
  groups.append("line")
    .attr("x1", x.bandwidth() / 2)
    .attr("x2", x.bandwidth() / 2)
    .attr("y1", (d) => y(d.min))
    .attr("y2", (d) => y(d.max))
    .attr("stroke", ink());
  const boxes = groups.append("rect")
    .attr("x", 0)
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.q3))
    .attr("height", (d) => Math.max(1, y(d.q1) - y(d.q3)))
    .attr("fill", (d) => d.color)
    .attr("opacity", 0.85);
  groups.append("line")
    .attr("x1", 0)
    .attr("x2", x.bandwidth())
    .attr("y1", (d) => y(d.median))
    .attr("y2", (d) => y(d.median))
    .attr("stroke", "currentColor")
    .attr("stroke-width", 2);
  bindHover(boxes, tooltip, (d) => `${d.category}<br>med ${formatNumber(d.median)}`);
  return () => tooltip.dispose();
}

export function renderChord(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const inner = Math.min(width, height);
  const outerRadius = inner * 0.42;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  const chord = d3.chord().padAngle(0.04).sortSubgroups(d3.descending)(data.matrix);
  const arc = d3.arc().innerRadius(outerRadius).outerRadius(outerRadius + 10);
  const ribbon = d3.ribbon().radius(outerRadius);
  const tooltip = createTooltipController();
  const groups = g.append("g").selectAll("path")
    .data(chord.groups)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => data.colors[d.index]);
  bindHover(groups, tooltip, (d) => data.names[d.index]);
  const ribbons = g.append("g").attr("fill-opacity", 0.7).selectAll("path")
    .data(chord)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", (d) => data.colors[d.target.index]);
  bindHover(ribbons, tooltip, (d) => `${data.names[d.source.index]} → ${data.names[d.target.index]}: ${formatNumber(d.source.value)}`);
  return () => tooltip.dispose();
}

export function renderStream(container, series, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const margin = {top: 12, right: 12, bottom: 28, left: 16};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const dates = series[0].data.map((d) => d.date);
  const keys = series.map((item) => item.name);
  const stacked = dates.map((date, i) => {
    const row = {date};
    for (const item of series) row[item.name] = item.data[i].value;
    return row;
  });
  const stack = d3.stack().keys(keys).offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut);
  const seriesData = stack(stacked);
  const x = d3.scaleTime().domain(d3.extent(dates)).range([0, innerWidth]);
  const y = d3.scaleLinear()
    .domain([d3.min(seriesData, (layer) => d3.min(layer, (d) => d[0])), d3.max(seriesData, (layer) => d3.max(layer, (d) => d[1]))])
    .range([innerHeight, 0]);
  const area = d3.area().x((d) => x(d.data.date)).y0((d) => y(d[0])).y1((d) => y(d[1])).curve(d3.curveBasis);
  const color = d3.scaleOrdinal().domain(keys).range(series.map((item) => item.color));
  const tooltip = createTooltipController();
  const paths = g.selectAll("path")
    .data(seriesData)
    .join("path")
    .attr("d", area)
    .attr("fill", (d) => color(d.key));
  bindHover(paths, tooltip, (d) => d.key);
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
  return () => tooltip.dispose();
}

export function renderCalendar(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const cell = Math.max(6, Math.min(14, Math.floor((width - 40) / 54)));
  const svg = createSvg(container, width, Math.max(height, cell * 9 + 20));
  const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(data, (d) => d.value) || 1]);
  const tooltip = createTooltipController();
  const g = svg.append("g").attr("transform", "translate(20,16)");
  const cells = g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", cell - 1)
    .attr("height", cell - 1)
    .attr("rx", 1)
    .attr("x", (d) => d.week * cell)
    .attr("y", (d) => d.day * cell)
    .attr("fill", (d) => color(d.value));
  bindHover(cells, tooltip, (d) => `${d.date.toISOString().slice(0, 10)}: ${d.value}`);
  return () => tooltip.dispose();
}

export function renderForce(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const svg = createSvg(container, width, height);
  const nodes = data.nodes.map((node) => ({...node}));
  const links = data.links.map((link) => ({...link}));
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(46))
    .force("charge", d3.forceManyBody().strength(-90))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius((d) => d.value + 2));
  const tooltip = createTooltipController();
  const link = svg.append("g")
    .attr("stroke", ink())
    .attr("stroke-opacity", 0.45)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));
  const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => d.value)
    .attr("fill", (d) => d.color)
    .call(d3.drag()
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }));
  bindHover(node, tooltip, (d) => `${d.name}<br>group ${d.group}`);
  simulation.on("tick", () => {
    link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
  return () => {
    simulation.stop();
    tooltip.dispose();
  };
}

export function renderBubble(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const svg = createSvg(container, width, height);
  const nodes = data.map((item) => ({...item}));
  const radius = (d) => Math.max(6, Math.sqrt(d.size) * 0.7);
  const simulation = d3.forceSimulation(nodes)
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide().radius((d) => radius(d) + 1.5));
  const tooltip = createTooltipController();
  const circles = svg.selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", radius)
    .attr("fill", (d) => d.color)
    .attr("opacity", 0.85);
  bindHover(circles, tooltip, (d) => `${d.name}<br>size ${formatNumber(d.size)}`);
  simulation.on("tick", () => {
    circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
  return () => {
    simulation.stop();
    tooltip.dispose();
  };
}

export function renderRadar(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const radius = Math.min(width, height) / 2 - 28;
  const svg = createSvg(container, width, height);
  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  const angle = d3.scaleLinear().domain([0, data.axes.length]).range([0, Math.PI * 2]);
  const r = d3.scaleLinear().domain([0, 100]).range([0, radius]);
  const line = d3.lineRadial().angle((_, i) => angle(i)).radius((d) => r(d)).curve(d3.curveLinearClosed);
  for (const tick of [25, 50, 75, 100]) {
    g.append("circle").attr("r", r(tick)).attr("fill", "none").attr("stroke", ink()).attr("stroke-opacity", 0.25);
  }
  data.axes.forEach((label, i) => {
    const x = Math.cos(angle(i) - Math.PI / 2) * (radius + 12);
    const y = Math.sin(angle(i) - Math.PI / 2) * (radius + 12);
    g.append("line").attr("x2", Math.cos(angle(i) - Math.PI / 2) * radius).attr("y2", Math.sin(angle(i) - Math.PI / 2) * radius).attr("stroke", ink()).attr("stroke-opacity", 0.3);
    g.append("text").attr("x", x).attr("y", y).attr("text-anchor", "middle").attr("dy", "0.35em").style("font-size", "10px").attr("fill", "currentColor").text(label);
  });
  const tooltip = createTooltipController();
  const paths = g.selectAll("path.series")
    .data(data.series)
    .join("path")
    .attr("class", "series")
    .attr("fill", (d) => d.color)
    .attr("fill-opacity", 0.2)
    .attr("stroke", (d) => d.color)
    .attr("stroke-width", 2)
    .attr("d", (d) => line(d.values));
  bindHover(paths, tooltip, (d) => d.name);
  return () => tooltip.dispose();
}

export function renderGeo(container, data, options = {}) {
  const {width, height} = measure(container, options.width, options.height);
  const svg = createSvg(container, width, height);
  const projection = d3.geoEqualEarth().fitExtent([[8, 8], [width - 8, height - 8]], {type: "Sphere"});
  const path = d3.geoPath(projection);
  svg.append("path").datum({type: "Sphere"}).attr("d", path).attr("fill", "var(--vp-c-bg-alt)");
  svg.append("path").datum(d3.geoGraticule10()).attr("d", path).attr("fill", "none").attr("stroke", ink()).attr("stroke-opacity", 0.25);
  svg.append("path").datum({type: "Sphere"}).attr("d", path).attr("fill", "none").attr("stroke", "currentColor");
  const tooltip = createTooltipController();
  const maxValue = d3.max(data, (d) => d.value) || 1;
  const dots = svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("transform", (d) => `translate(${projection([d.lng, d.lat])})`)
    .attr("r", (d) => 4 + 10 * Math.sqrt(d.value / maxValue))
    .attr("fill", (d) => d.color)
    .attr("fill-opacity", 0.75)
    .attr("stroke", "currentColor")
    .attr("stroke-width", 0.5);
  bindHover(dots, tooltip, (d) => `${d.name}<br>${formatNumber(d.value)}M`);
  return () => tooltip.dispose();
}

const GALLERY_RENDERERS = {
  bar: renderBar,
  line: renderLine,
  pie: renderPie,
  donut: renderDonut,
  scatter: renderScatter,
  area: renderArea,
  heatmap: renderHeatmap,
  treemap: renderTreemap,
  box: renderBox,
  chord: renderChord,
  stream: renderStream,
  calendar: renderCalendar,
  force: renderForce,
  bubble: renderBubble,
  radar: renderRadar,
  geo: renderGeo
};

export function renderChart(renderKey, container, data, options = {}) {
  const renderer = GALLERY_RENDERERS[renderKey];
  if (!renderer) throw new Error(`Unknown chart type: ${renderKey}`);
  return renderer(container, data, options);
}

export function getColorScale(scheme, count) {
  const sequential = {
    viridis: d3.interpolateViridis,
    plasma: d3.interpolatePlasma,
    inferno: d3.interpolateInferno,
    turbo: d3.interpolateTurbo
  };
  if (sequential[scheme]) {
    return d3.scaleSequential(sequential[scheme]).domain([0, Math.max(count - 1, 1)]);
  }
  const discrete = scheme === "tableau10" ? d3.schemeTableau10 : d3.schemeCategory10;
  return d3.scaleOrdinal(discrete);
}

export function rowsToChartData(type, rows, xColumn, yColumn) {
  if (type === "pie") return aggregateNumericByKey(rows, xColumn, yColumn);
  if (type === "bar") return aggregateNumericByKey(rows, xColumn, yColumn);
  if (type === "scatter") {
    return rows.map((row, i) => ({
      x: Number(row[xColumn]),
      y: Number(row[yColumn]),
      size: 10,
      color: PALETTE[i % PALETTE.length]
    })).filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
  }
  if (type === "line" || type === "area") {
    const grouped = d3.rollups(rows, (values) => d3.sum(values, (row) => Number(row[yColumn]) || 0), (row) => row[xColumn]);
    const points = grouped.map(([x, value]) => ({x, date: x, y: value, value}));
    return [{name: yColumn, color: PALETTE[0], data: points}];
  }
  if (type === "heatmap") {
    const xValues = [...new Set(rows.map((row) => row[xColumn]))];
    const yValues = [...new Set(rows.map((row) => row[yColumn]))];
    return yValues.flatMap((day) => xValues.map((hour) => ({
      day: String(day),
      hour: String(hour),
      value: rows.filter((row) => row[xColumn] === hour && row[yColumn] === day).length
    })));
  }
  throw new Error(`Unsupported playground chart: ${type}`);
}

export function renderPlaygroundChart(type, container, rows, {xColumn, yColumn, scheme = "category10", animate = true} = {}) {
  const prepared = rowsToChartData(type, rows, xColumn, yColumn);
  const color = getColorScale(scheme, Array.isArray(prepared) ? prepared.length : 1);
  if (type === "bar" || type === "pie") {
    prepared.forEach((row, i) => { row.color = color(i); });
    return type === "bar" ? renderBar(container, prepared, {animate}) : renderPie(container, prepared, {animate});
  }
  if (type === "line") {
    prepared.forEach((row, i) => { row.color = color(i); });
    return renderLine(container, prepared, {animate});
  }
  if (type === "area") {
    prepared.forEach((row, i) => { row.color = color(i); });
    return renderArea(container, prepared, {animate});
  }
  if (type === "scatter") {
    prepared.forEach((row, i) => { row.color = color(i); });
    return renderScatter(container, prepared, {animate});
  }
  return renderHeatmap(container, prepared, {animate});
}

export function serializeSvg(svg) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const source = new XMLSerializer().serializeToString(clone);
  return `<?xml version="1.0" standalone="no"?>\n${source}`;
}

export const galleryRenderKeys = Object.keys(GALLERY_RENDERERS);
