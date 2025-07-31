// Data Visualization Studio - Main JavaScript File
import { sampleDatasets, getColumns, getColumnType, getSuggestedCharts } from './sample-data.js';

class DataVisualizationStudio {
    constructor() {
        this.currentData = null;
        this.currentDataset = null;
        this.currentChart = 'bar';
        this.currentTheme = 'light';
        
        this.initializeEventListeners();
        this.setupTheme();
        this.loadSampleDataOptions();
    }

    initializeEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Data source selection
        document.querySelectorAll('.source-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectDataSource(e.currentTarget.dataset.source);
            });
        });

        // Chart type selection
        document.querySelectorAll('.chart-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectChartType(e.currentTarget.dataset.chart);
            });
        });

        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // API fetch
        document.getElementById('fetchApi').addEventListener('click', () => {
            this.fetchApiData();
        });

        // Configuration changes
        document.getElementById('xAxis').addEventListener('change', () => {
            this.updateVisualization();
        });
        document.getElementById('yAxis').addEventListener('change', () => {
            this.updateVisualization();
        });
        document.getElementById('colorScheme').addEventListener('change', () => {
            this.updateVisualization();
        });

        // Export functionality
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportVisualization();
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    loadSampleDataOptions() {
        // Create sample data selection modal
        this.createSampleDataModal();
    }

    createSampleDataModal() {
        const modal = document.createElement('div');
        modal.className = 'sample-data-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Select Sample Dataset</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${Object.entries(sampleDatasets).map(([key, dataset]) => `
                        <div class="dataset-option" data-dataset="${key}">
                            <h4>${dataset.name}</h4>
                            <p>${dataset.description}</p>
                            <span class="dataset-size">${dataset.data.length} records</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.querySelectorAll('.dataset-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const datasetKey = e.currentTarget.dataset.dataset;
                this.loadSampleData(datasetKey);
                modal.style.display = 'none';
            });
        });
        
        // Add modal styles
        const modalStyles = `
            <style>
            .sample-data-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: 0.5rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .modal-body {
                padding: 1rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            .dataset-option {
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .dataset-option:hover {
                background: var(--accent-primary);
                color: white;
                transform: translateY(-1px);
            }
            .dataset-option h4 {
                margin: 0 0 0.5rem 0;
                font-weight: 600;
            }
            .dataset-option p {
                margin: 0 0 0.5rem 0;
                opacity: 0.8;
            }
            .dataset-size {
                font-size: 0.875rem;
                opacity: 0.7;
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }

    selectDataSource(source) {
        // Update UI
        document.querySelectorAll('.source-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-source="${source}"]`).classList.add('active');

        // Hide/show appropriate inputs
        document.getElementById('fileUpload').style.display = 
            (source === 'csv' || source === 'json') ? 'block' : 'none';
        document.getElementById('apiInput').style.display = 
            source === 'api' ? 'block' : 'none';

        if (source === 'sample') {
            document.querySelector('.sample-data-modal').style.display = 'flex';
        }
    }

    loadSampleData(datasetKey) {
        const dataset = sampleDatasets[datasetKey];
        this.currentData = dataset.data;
        this.currentDataset = dataset;
        this.processData();
    }

    async handleFileUpload(file) {
        if (!file) return;

        this.showLoading(true);
        
        try {
            const text = await file.text();
            let data;

            if (file.name.endsWith('.csv')) {
                data = this.parseCSV(text);
            } else if (file.name.endsWith('.json')) {
                data = JSON.parse(text);
            } else {
                throw new Error('Unsupported file format');
            }

            this.currentData = Array.isArray(data) ? data : [data];
            this.currentDataset = {
                name: file.name,
                description: `Uploaded ${file.type} file`,
                data: this.currentData
            };
            
            this.processData();
        } catch (error) {
            this.showError(`Error loading file: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    async fetchApiData() {
        const url = document.getElementById('apiUrl').value;
        if (!url) return;

        this.showLoading(true);
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.currentData = Array.isArray(data) ? data : [data];
            this.currentDataset = {
                name: 'API Data',
                description: `Data from ${url}`,
                data: this.currentData
            };
            
            this.processData();
        } catch (error) {
            this.showError(`Error fetching data: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj = {};
            
            headers.forEach((header, index) => {
                let value = values[index];
                // Try to parse as number
                const numValue = parseFloat(value);
                obj[header] = isNaN(numValue) ? value : numValue;
            });
            
            return obj;
        });
    }

    processData() {
        if (!this.currentData || this.currentData.length === 0) {
            this.showError('No data to process');
            return;
        }

        // Update UI
        this.hideEmptyState();
        this.updateDataStats();
        this.populateColumnSelectors();
        this.showDataPreview();
        this.updateVisualization();
    }

    updateDataStats() {
        document.getElementById('dataCount').textContent = `${this.currentData.length} records`;
        document.getElementById('vizTitle').textContent = 
            this.currentDataset?.name || 'Data Visualization';
    }

    populateColumnSelectors() {
        const columns = getColumns(this.currentData);
        const xSelect = document.getElementById('xAxis');
        const ySelect = document.getElementById('yAxis');
        
        // Clear existing options
        xSelect.innerHTML = '<option value="">Select column...</option>';
        ySelect.innerHTML = '<option value="">Select column...</option>';
        
        columns.forEach(column => {
            xSelect.add(new Option(column.name, column.name));
            ySelect.add(new Option(column.name, column.name));
        });
        
        // Auto-select reasonable defaults
        const categoricalColumns = columns.filter(c => c.type === 'categorical');
        const numericColumns = columns.filter(c => c.type === 'numeric');
        
        if (categoricalColumns.length > 0) {
            xSelect.value = categoricalColumns[0].name;
        }
        if (numericColumns.length > 0) {
            ySelect.value = numericColumns[0].name;
        }
    }

    showDataPreview() {
        const preview = document.getElementById('dataPreview');
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        if (!this.currentData || this.currentData.length === 0) return;
        
        // Create headers
        const headers = Object.keys(this.currentData[0]);
        tableHead.innerHTML = headers.map(header => `<th>${header}</th>`).join('');
        
        // Create rows (limit to first 10 for performance)
        const previewData = this.currentData.slice(0, 10);
        tableBody.innerHTML = previewData.map(row => 
            `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`
        ).join('');
        
        preview.style.display = 'block';
    }

    selectChartType(chartType) {
        document.querySelectorAll('.chart-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
        
        this.currentChart = chartType;
        this.updateVisualization();
    }

    updateVisualization() {
        if (!this.currentData) return;
        
        const xColumn = document.getElementById('xAxis').value;
        const yColumn = document.getElementById('yAxis').value;
        const colorScheme = document.getElementById('colorScheme').value;
        
        if (!xColumn || !yColumn) return;
        
        this.showChart();
        this.renderChart(xColumn, yColumn, colorScheme);
    }

    showChart() {
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('chartContainer').classList.add('active');
    }

    hideEmptyState() {
        document.getElementById('emptyState').style.display = 'none';
    }

    renderChart(xColumn, yColumn, colorScheme) {
        // Clear previous chart
        d3.select('#mainChart').selectAll('*').remove();
        
        const container = document.getElementById('chartContainer');
        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;
        
        const svg = d3.select('#mainChart')
            .attr('width', container.clientWidth)
            .attr('height', container.clientHeight);
            
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Get color scale
        const colorScale = this.getColorScale(colorScheme);
        
        switch (this.currentChart) {
            case 'bar':
                this.renderBarChart(g, width, height, xColumn, yColumn, colorScale);
                break;
            case 'line':
                this.renderLineChart(g, width, height, xColumn, yColumn, colorScale);
                break;
            case 'pie':
                this.renderPieChart(g, width, height, xColumn, yColumn, colorScale);
                break;
            case 'scatter':
                this.renderScatterPlot(g, width, height, xColumn, yColumn, colorScale);
                break;
            case 'area':
                this.renderAreaChart(g, width, height, xColumn, yColumn, colorScale);
                break;
            case 'heatmap':
                this.renderHeatmap(g, width, height, xColumn, yColumn, colorScale);
                break;
        }
    }

    getColorScale(scheme) {
        switch (scheme) {
            case 'viridis':
                return d3.scaleSequential(d3.interpolateViridis);
            case 'plasma':
                return d3.scaleSequential(d3.interpolatePlasma);
            case 'inferno':
                return d3.scaleSequential(d3.interpolateInferno);
            case 'turbo':
                return d3.scaleSequential(d3.interpolateTurbo);
            default:
                return d3.scaleOrdinal(d3.schemeCategory10);
        }
    }

    renderBarChart(g, width, height, xColumn, yColumn, colorScale) {
        // Aggregate data by x column
        const aggregatedData = d3.rollups(
            this.currentData,
            v => d3.sum(v, d => d[yColumn]),
            d => d[xColumn]
        ).map(([key, value]) => ({ [xColumn]: key, [yColumn]: value }));

        const xScale = d3.scaleBand()
            .domain(aggregatedData.map(d => d[xColumn]))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d[yColumn])])
            .range([height, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Add bars
        g.selectAll('.bar')
            .data(aggregatedData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d[xColumn]))
            .attr('width', xScale.bandwidth())
            .attr('y', d => yScale(d[yColumn]))
            .attr('height', d => height - yScale(d[yColumn]))
            .attr('fill', (d, i) => colorScale(i))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('opacity', 0.7);
                // Add tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)
                    .style('position', 'absolute')
                    .style('background', 'var(--bg-primary)')
                    .style('border', '1px solid var(--border-color)')
                    .style('border-radius', '4px')
                    .style('padding', '8px')
                    .style('font-size', '12px')
                    .style('box-shadow', '0 2px 8px var(--shadow)');
                
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.html(`${xColumn}: ${d[xColumn]}<br/>${yColumn}: ${d[yColumn]}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 1);
                d3.selectAll('.tooltip').remove();
            });

        // Add labels
        this.addAxisLabels(g, width, height, xColumn, yColumn);
    }

    renderLineChart(g, width, height, xColumn, yColumn, colorScale) {
        // Sort data by x column
        const sortedData = [...this.currentData].sort((a, b) => {
            if (typeof a[xColumn] === 'string') {
                return a[xColumn].localeCompare(b[xColumn]);
            }
            return a[xColumn] - b[xColumn];
        });

        const xScale = d3.scalePoint()
            .domain(sortedData.map(d => d[xColumn]))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(sortedData, d => d[yColumn]))
            .range([height, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Add line
        const line = d3.line()
            .x(d => xScale(d[xColumn]))
            .y(d => yScale(d[yColumn]))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(sortedData)
            .attr('fill', 'none')
            .attr('stroke', colorScale(0))
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add points
        g.selectAll('.dot')
            .data(sortedData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d[xColumn]))
            .attr('cy', d => yScale(d[yColumn]))
            .attr('r', 4)
            .attr('fill', colorScale(0));

        this.addAxisLabels(g, width, height, xColumn, yColumn);
    }

    renderPieChart(g, width, height, xColumn, yColumn, colorScale) {
        const radius = Math.min(width, height) / 2;
        const centerG = g.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

        // Aggregate data
        const aggregatedData = d3.rollups(
            this.currentData,
            v => d3.sum(v, d => d[yColumn]),
            d => d[xColumn]
        ).map(([key, value]) => ({ [xColumn]: key, [yColumn]: value }));

        const pie = d3.pie()
            .value(d => d[yColumn]);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius - 10);

        const arcs = centerG.selectAll('.arc')
            .data(pie(aggregatedData))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => colorScale(i))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('opacity', 0.7);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 1);
            });

        // Add labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .text(d => d.data[xColumn]);
    }

    renderScatterPlot(g, width, height, xColumn, yColumn, colorScale) {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(this.currentData, d => d[xColumn]))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(this.currentData, d => d[yColumn]))
            .range([height, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Add points
        g.selectAll('.dot')
            .data(this.currentData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d[xColumn]))
            .attr('cy', d => yScale(d[yColumn]))
            .attr('r', 5)
            .attr('fill', (d, i) => colorScale(i))
            .attr('opacity', 0.7);

        this.addAxisLabels(g, width, height, xColumn, yColumn);
    }

    renderAreaChart(g, width, height, xColumn, yColumn, colorScale) {
        const sortedData = [...this.currentData].sort((a, b) => {
            if (typeof a[xColumn] === 'string') {
                return a[xColumn].localeCompare(b[xColumn]);
            }
            return a[xColumn] - b[xColumn];
        });

        const xScale = d3.scalePoint()
            .domain(sortedData.map(d => d[xColumn]))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d[yColumn])])
            .range([height, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Add area
        const area = d3.area()
            .x(d => xScale(d[xColumn]))
            .y0(height)
            .y1(d => yScale(d[yColumn]))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(sortedData)
            .attr('fill', colorScale(0))
            .attr('opacity', 0.6)
            .attr('d', area);

        this.addAxisLabels(g, width, height, xColumn, yColumn);
    }

    renderHeatmap(g, width, height, xColumn, yColumn, colorScale) {
        // This is a simplified heatmap - in practice you'd want more sophisticated binning
        const xValues = [...new Set(this.currentData.map(d => d[xColumn]))];
        const yValues = [...new Set(this.currentData.map(d => d[yColumn]))];

        const xScale = d3.scaleBand()
            .domain(xValues)
            .range([0, width])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(yValues)
            .range([height, 0])
            .padding(0.05);

        // Create grid data
        const gridData = [];
        xValues.forEach(x => {
            yValues.forEach(y => {
                const count = this.currentData.filter(d => d[xColumn] === x && d[yColumn] === y).length;
                gridData.push({ x, y, count });
            });
        });

        const colorScaleHeat = d3.scaleSequential(d3.interpolateYlOrRd)
            .domain([0, d3.max(gridData, d => d.count)]);

        g.selectAll('.cell')
            .data(gridData)
            .enter().append('rect')
            .attr('class', 'cell')
            .attr('x', d => xScale(d.x))
            .attr('y', d => yScale(d.y))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('fill', d => colorScaleHeat(d.count));

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        this.addAxisLabels(g, width, height, xColumn, yColumn);
    }

    addAxisLabels(g, width, height, xColumn, yColumn) {
        // X-axis label
        g.append('text')
            .attr('transform', `translate(${width/2}, ${height + 40})`)
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', 'var(--text-primary)')
            .text(xColumn);

        // Y-axis label
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - 60)
            .attr('x', 0 - (height / 2))
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', 'var(--text-primary)')
            .text(yColumn);
    }

    exportVisualization() {
        const svg = document.getElementById('mainChart');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Download as PNG
            const link = document.createElement('a');
            link.download = 'visualization.png';
            link.href = canvas.toDataURL();
            link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
        if (show) {
            document.getElementById('emptyState').style.display = 'none';
            document.getElementById('chartContainer').classList.remove('active');
        }
    }

    showError(message) {
        // Simple error display - in production you'd want a proper notification system
        alert(message);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DataVisualizationStudio();
});