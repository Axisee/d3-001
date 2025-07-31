// Data Generator for D3.js Visualization Showcase
class DataGenerator {
    constructor() {
        this.colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
        ];
    }

    // Generate random data with normal distribution
    randomNormal(mean = 0, stdDev = 1) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    // Generate sample names/categories
    generateNames(count, type = 'generic') {
        const names = {
            countries: ['USA', 'China', 'Japan', 'Germany', 'UK', 'France', 'India', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 'Australia', 'Spain', 'Mexico'],
            companies: ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta', 'Tesla', 'Netflix', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 'PayPal', 'Uber'],
            products: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F', 'Product G', 'Product H', 'Product I', 'Product J'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
            categories: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
            cities: ['New York', 'Los Angeles', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Dubai', 'Singapore']
        };
        
        const selectedNames = names[type] || names.generic;
        return selectedNames.slice(0, count);
    }

    // Basic bar chart data
    generateBarChartData(count = 8) {
        const categories = this.generateNames(count, 'products');
        return categories.map((name, i) => ({
            name,
            value: Math.floor(Math.random() * 100) + 20,
            color: this.colors[i % this.colors.length]
        }));
    }

    // Line chart data with multiple series
    generateLineChartData(points = 12, series = 3) {
        const months = this.generateNames(points, 'months');
        const seriesNames = ['Series A', 'Series B', 'Series C', 'Series D', 'Series E'];
        
        return Array.from({ length: series }, (_, i) => ({
            name: seriesNames[i],
            color: this.colors[i % this.colors.length],
            data: months.map((month, j) => ({
                x: month,
                y: Math.floor(this.randomNormal(50, 15)) + (i * 10)
            }))
        }));
    }

    // Pie chart data
    generatePieChartData(count = 6) {
        const categories = this.generateNames(count, 'categories');
        const values = categories.map(() => Math.random() * 100 + 10);
        const total = values.reduce((a, b) => a + b, 0);
        
        return categories.map((name, i) => ({
            name,
            value: values[i],
            percentage: (values[i] / total * 100).toFixed(1),
            color: this.colors[i % this.colors.length]
        }));
    }

    // Scatter plot data
    generateScatterPlotData(count = 100) {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: this.randomNormal(50, 20),
            y: this.randomNormal(50, 20),
            size: Math.random() * 20 + 5,
            category: Math.floor(Math.random() * 4),
            color: this.colors[Math.floor(Math.random() * 4)]
        }));
    }

    // Bubble chart data
    generateBubbleChartData(count = 30) {
        const countries = this.generateNames(count, 'countries');
        return countries.map((name, i) => ({
            name,
            x: Math.random() * 100 + 10, // GDP per capita
            y: Math.random() * 90 + 50,  // Life expectancy
            size: Math.random() * 1000 + 100, // Population
            color: this.colors[i % this.colors.length]
        }));
    }

    // Area chart data
    generateAreaChartData(points = 20, series = 2) {
        const dates = Array.from({ length: points }, (_, i) => {
            const date = new Date(2023, 0, i * 15);
            return date.toISOString().split('T')[0];
        });
        
        return Array.from({ length: series }, (_, i) => ({
            name: `Dataset ${i + 1}`,
            color: this.colors[i % this.colors.length],
            data: dates.map((date, j) => ({
                date,
                value: Math.max(0, this.randomNormal(30, 10) + Math.sin(j * 0.5) * 20)
            }))
        }));
    }

    // Heatmap data
    generateHeatmapData(rows = 7, cols = 24) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: cols }, (_, i) => `${i}:00`);
        
        return days.slice(0, rows).map((day, i) => 
            hours.map((hour, j) => ({
                day,
                hour,
                value: Math.floor(Math.random() * 100),
                dayIndex: i,
                hourIndex: j
            }))
        ).flat();
    }

    // Hierarchical data for tree maps
    generateTreemapData(depth = 3, maxChildren = 5) {
        const generateNode = (level, parentName = '') => {
            const name = parentName ? `${parentName}.${level}` : `Root ${level}`;
            
            if (depth <= 1) {
                return {
                    name,
                    value: Math.floor(Math.random() * 100) + 10,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)]
                };
            }
            
            const childCount = Math.floor(Math.random() * maxChildren) + 2;
            return {
                name,
                children: Array.from({ length: childCount }, (_, i) => 
                    generateNode(depth - 1, name + '.' + i)
                )
            };
        };
        
        return generateNode(depth);
    }

    // Network/Force layout data
    generateNetworkData(nodeCount = 20, linkCount = 30) {
        const nodes = Array.from({ length: nodeCount }, (_, i) => ({
            id: i,
            name: `Node ${i}`,
            group: Math.floor(Math.random() * 4),
            value: Math.random() * 20 + 5,
            color: this.colors[Math.floor(Math.random() * 4)]
        }));
        
        const links = Array.from({ length: linkCount }, () => ({
            source: Math.floor(Math.random() * nodeCount),
            target: Math.floor(Math.random() * nodeCount),
            value: Math.random() * 10 + 1
        }));
        
        return { nodes, links };
    }

    // Time series data
    generateTimeSeriesData(days = 365, series = 1) {
        const startDate = new Date(2023, 0, 1);
        const dates = Array.from({ length: days }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date;
        });
        
        return Array.from({ length: series }, (_, i) => ({
            name: `Series ${i + 1}`,
            color: this.colors[i % this.colors.length],
            data: dates.map((date, j) => ({
                date,
                value: this.randomNormal(100, 20) + Math.sin(j * 0.1) * 30
            }))
        }));
    }

    // Geographical data (simplified)
    generateGeoData() {
        const countries = [
            { name: 'United States', code: 'US', lat: 39.8283, lng: -98.5795, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'China', code: 'CN', lat: 35.8617, lng: 104.1954, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'France', code: 'FR', lat: 46.6034, lng: 1.8883, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'India', code: 'IN', lat: 20.5937, lng: 78.9629, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468, value: Math.floor(Math.random() * 1000) + 100 },
            { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, value: Math.floor(Math.random() * 1000) + 100 }
        ];
        
        return countries;
    }

    // Sankey diagram data
    generateSankeyData() {
        const nodes = [
            { id: 'A', name: 'Source A' },
            { id: 'B', name: 'Source B' },
            { id: 'C', name: 'Source C' },
            { id: 'X', name: 'Middle X' },
            { id: 'Y', name: 'Middle Y' },
            { id: 'Z', name: 'Target Z' }
        ];
        
        const links = [
            { source: 'A', target: 'X', value: 10 },
            { source: 'B', target: 'X', value: 15 },
            { source: 'C', target: 'Y', value: 20 },
            { source: 'X', target: 'Z', value: 25 },
            { source: 'Y', target: 'Z', value: 20 }
        ];
        
        return { nodes, links };
    }

    // Violin plot data
    generateViolinPlotData(categories = 4, pointsPerCategory = 100) {
        const categoryNames = this.generateNames(categories, 'categories');
        
        return categoryNames.map((name, i) => ({
            category: name,
            values: Array.from({ length: pointsPerCategory }, () => 
                this.randomNormal(50 + i * 10, 15)
            ),
            color: this.colors[i % this.colors.length]
        }));
    }

    // Box plot data
    generateBoxPlotData(categories = 5) {
        const categoryNames = this.generateNames(categories, 'categories');
        
        return categoryNames.map((name, i) => {
            const values = Array.from({ length: 100 }, () => 
                this.randomNormal(50 + i * 5, 10)
            ).sort((a, b) => a - b);
            
            return {
                category: name,
                min: values[0],
                q1: values[24],
                median: values[49],
                q3: values[74],
                max: values[99],
                outliers: values.filter((v, idx) => 
                    idx < 5 || idx > 94
                ).slice(0, 10),
                color: this.colors[i % this.colors.length]
            };
        });
    }

    // Radar chart data
    generateRadarChartData(axes = 6, series = 3) {
        const axisNames = ['Speed', 'Strength', 'Intelligence', 'Endurance', 'Agility', 'Charisma'];
        const seriesNames = ['Character A', 'Character B', 'Character C'];
        
        return {
            axes: axisNames.slice(0, axes),
            series: Array.from({ length: series }, (_, i) => ({
                name: seriesNames[i],
                values: Array.from({ length: axes }, () => 
                    Math.floor(Math.random() * 100) + 10
                ),
                color: this.colors[i % this.colors.length]
            }))
        };
    }

    // Calendar heatmap data
    generateCalendarData(year = 2023) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const data = [];
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            data.push({
                date: new Date(d),
                value: Math.floor(Math.random() * 20),
                day: d.getDay(),
                week: Math.floor((d - startDate) / (7 * 24 * 60 * 60 * 1000))
            });
        }
        
        return data;
    }

    // Chord diagram data
    generateChordData(size = 5) {
        const names = this.generateNames(size, 'categories');
        const matrix = Array.from({ length: size }, () => 
            Array.from({ length: size }, () => Math.floor(Math.random() * 100))
        );
        
        // Make matrix symmetric
        for (let i = 0; i < size; i++) {
            for (let j = i; j < size; j++) {
                matrix[j][i] = matrix[i][j];
            }
            matrix[i][i] = 0; // No self-connections
        }
        
        return {
            names,
            matrix,
            colors: this.colors.slice(0, size)
        };
    }

    // Stream graph data
    generateStreamData(layers = 5, points = 50) {
        const dates = Array.from({ length: points }, (_, i) => {
            const date = new Date(2023, 0, i * 7);
            return date;
        });
        
        return Array.from({ length: layers }, (_, i) => ({
            name: `Layer ${i + 1}`,
            color: this.colors[i % this.colors.length],
            data: dates.map((date, j) => ({
                date,
                value: Math.max(0, this.randomNormal(20, 10) + Math.sin(j * 0.2 + i) * 15)
            }))
        }));
    }
}

// Create global instance
window.dataGenerator = new DataGenerator();