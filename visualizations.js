// D3.js Visualization Library for Showcase
class VisualizationLibrary {
    constructor() {
        this.animations = {
            enabled: true,
            speed: 1,
            duration: () => 750 / this.animations.speed
        };
        this.tooltips = { enabled: true };
    }

    // Utility functions
    createTooltip() {
        return d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('z-index', 10000);
    }

    showTooltip(tooltip, content, event) {
        if (!this.tooltips.enabled) return;
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    hideTooltip(tooltip) {
        if (!this.tooltips.enabled) return;
        tooltip.transition().duration(200).style('opacity', 0);
    }

    // 1. Bar Chart
    createBarChart(container, data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.name));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data, d => d.value)]);

        const tooltip = this.createTooltip();

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        const bars = g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.name))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', d => d.color)
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.name}: ${d.value}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        if (this.animations.enabled) {
            bars.transition()
                .duration(this.animations.duration())
                .delay((d, i) => i * 100)
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value));
        } else {
            bars.attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value));
        }

        return svg.node();
    }

    // 2. Line Chart
    createLineChart(container, data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .domain(data[0].data.map(d => d.x));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain(d3.extent(data.flatMap(s => s.data), d => d.y));

        const line = d3.line()
            .x(d => x(d.x) + x.bandwidth() / 2)
            .y(d => y(d.y))
            .curve(d3.curveMonotoneX);

        const tooltip = this.createTooltip();

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        data.forEach((series, i) => {
            const path = g.append('path')
                .datum(series.data)
                .attr('fill', 'none')
                .attr('stroke', series.color)
                .attr('stroke-width', 2)
                .attr('d', line);

            if (this.animations.enabled) {
                const totalLength = path.node().getTotalLength();
                path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
                    .attr('stroke-dashoffset', totalLength)
                    .transition()
                    .duration(this.animations.duration())
                    .delay(i * 200)
                    .attr('stroke-dashoffset', 0);
            }

            g.selectAll(`.dot-${i}`)
                .data(series.data)
                .enter().append('circle')
                .attr('class', `dot-${i}`)
                .attr('cx', d => x(d.x) + x.bandwidth() / 2)
                .attr('cy', d => y(d.y))
                .attr('r', 4)
                .attr('fill', series.color)
                .on('mouseover', (event, d) => {
                    this.showTooltip(tooltip, `${series.name}<br/>${d.x}: ${d.y}`, event);
                })
                .on('mouseout', () => this.hideTooltip(tooltip));
        });

        return svg.node();
    }

    // 3. Pie Chart
    createPieChart(container, data) {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        const radius = Math.min(width, height) / 2 - 10;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const tooltip = this.createTooltip();

        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color)
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.data.name}: ${d.data.percentage}%`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        if (this.animations.enabled) {
            arcs.selectAll('path')
                .transition()
                .duration(this.animations.duration())
                .attrTween('d', function(d) {
                    const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
        }

        return svg.node();
    }

    // 4. Scatter Plot
    createScatterPlot(container, data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .rangeRound([0, width])
            .domain(d3.extent(data, d => d.x));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain(d3.extent(data, d => d.y));

        const tooltip = this.createTooltip();

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        const circles = g.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', d => d.size / 2)
            .attr('fill', d => d.color)
            .attr('opacity', 0.7)
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `X: ${d.x.toFixed(1)}<br/>Y: ${d.y.toFixed(1)}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        if (this.animations.enabled) {
            circles.attr('r', 0)
                .transition()
                .duration(this.animations.duration())
                .delay((d, i) => i * 10)
                .attr('r', d => d.size / 2);
        }

        return svg.node();
    }

    // 5. Area Chart
    createAreaChart(container, data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const parseDate = d3.timeParse('%Y-%m-%d');
        data.forEach(series => {
            series.data.forEach(d => {
                d.date = parseDate(d.date);
            });
        });

        const x = d3.scaleTime()
            .rangeRound([0, width])
            .domain(d3.extent(data[0].data, d => d.date));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data.flatMap(s => s.data), d => d.value)]);

        const area = d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.value))
            .curve(d3.curveMonotoneX);

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        data.forEach((series, i) => {
            const path = g.append('path')
                .datum(series.data)
                .attr('fill', series.color)
                .attr('opacity', 0.7)
                .attr('d', area);

            if (this.animations.enabled) {
                path.attr('opacity', 0)
                    .transition()
                    .duration(this.animations.duration())
                    .delay(i * 200)
                    .attr('opacity', 0.7);
            }
        });

        return svg.node();
    }

    // 6. Heatmap
    createHeatmap(container, data) {
        const margin = { top: 30, right: 30, bottom: 30, left: 50 };
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const days = [...new Set(data.map(d => d.day))];
        const hours = [...new Set(data.map(d => d.hour))];

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .domain(hours)
            .padding(0.05);

        const y = d3.scaleBand()
            .rangeRound([0, height])
            .domain(days)
            .padding(0.05);

        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain(d3.extent(data, d => d.value));

        const tooltip = this.createTooltip();

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        const cells = g.selectAll('.cell')
            .data(data)
            .enter().append('rect')
            .attr('class', 'cell')
            .attr('x', d => x(d.hour))
            .attr('y', d => y(d.day))
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .attr('fill', d => colorScale(d.value))
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.day} ${d.hour}: ${d.value}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        if (this.animations.enabled) {
            cells.attr('opacity', 0)
                .transition()
                .duration(this.animations.duration())
                .delay((d, i) => i * 5)
                .attr('opacity', 1);
        }

        return svg.node();
    }

    // 7. Force-Directed Network
    createForceLayout(container, data) {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const tooltip = this.createTooltip();

        const link = svg.append('g')
            .selectAll('line')
            .data(data.links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value));

        const node = svg.append('g')
            .selectAll('circle')
            .data(data.nodes)
            .enter().append('circle')
            .attr('r', d => d.value)
            .attr('fill', d => d.color)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.name}<br/>Group: ${d.group}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        simulation.on('tick', () => {
            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return svg.node();
    }

    // 8. Treemap
    createTreemap(container, data) {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        const treemap = d3.treemap()
            .size([width, height])
            .padding(1);

        treemap(root);

        const tooltip = this.createTooltip();

        const cell = svg.selectAll('g')
            .data(root.leaves())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        cell.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', d => d.data.color || '#69b3a2')
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.data.name}: ${d.data.value}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        cell.append('text')
            .attr('x', 4)
            .attr('y', 14)
            .text(d => d.data.name)
            .attr('font-size', '10px')
            .attr('fill', 'white');

        if (this.animations.enabled) {
            cell.selectAll('rect')
                .attr('width', 0)
                .attr('height', 0)
                .transition()
                .duration(this.animations.duration())
                .delay((d, i) => i * 50)
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0);
        }

        return svg.node();
    }

    // 9. Donut Chart
    createDonutChart(container, data) {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        const radius = Math.min(width, height) / 2 - 10;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);

        const tooltip = this.createTooltip();

        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color)
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.data.name}: ${d.data.percentage}%`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        // Center text
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .text('Total')
            .style('font-size', '14px')
            .style('font-weight', 'bold');

        if (this.animations.enabled) {
            arcs.selectAll('path')
                .transition()
                .duration(this.animations.duration())
                .attrTween('d', function(d) {
                    const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
        }

        return svg.node();
    }

    // 10. Bubble Chart
    createBubbleChart(container, data) {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(data)
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 2).strength(0.05))
            .force('collide', d3.forceCollide().radius(d => Math.sqrt(d.size) + 2));

        const tooltip = this.createTooltip();

        const nodes = svg.append('g')
            .selectAll('circle')
            .data(data)
            .enter().append('circle')
            .attr('r', d => Math.sqrt(d.size))
            .attr('fill', d => d.color)
            .attr('opacity', 0.8)
            .on('mouseover', (event, d) => {
                this.showTooltip(tooltip, `${d.name}<br/>X: ${d.x.toFixed(1)}<br/>Y: ${d.y.toFixed(1)}<br/>Size: ${d.size}`, event);
            })
            .on('mouseout', () => this.hideTooltip(tooltip));

        simulation.on('tick', () => {
            nodes.attr('cx', d => d.x)
                 .attr('cy', d => d.y);
        });

        if (this.animations.enabled) {
            nodes.attr('r', 0)
                .transition()
                .duration(this.animations.duration())
                .delay((d, i) => i * 50)
                .attr('r', d => Math.sqrt(d.size));
        }

        return svg.node();
    }
}

// Create global instance
window.visualizationLibrary = new VisualizationLibrary();