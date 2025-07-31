// Main Showcase Application
class ShowcaseApp {
    constructor() {
        this.currentCategory = 'all';
        this.currentView = 'grid';
        this.searchTerm = '';
        this.visualizations = this.initializeVisualizations();
        this.filteredVisualizations = [...this.visualizations];
        
        this.init();
    }

    initializeVisualizations() {
        return [
            {
                id: 'bar-chart',
                title: 'Bar Chart',
                description: 'Classic bar chart showing categorical data with customizable colors and animations.',
                category: 'basic',
                tags: ['basic', 'categorical', 'comparison'],
                createFunction: 'createBarChart',
                dataFunction: 'generateBarChartData',
                code: `// Bar Chart Example
const data = dataGenerator.generateBarChartData(8);
const chart = visualizationLibrary.createBarChart(container, data);`
            },
            {
                id: 'line-chart',
                title: 'Line Chart',
                description: 'Multi-series line chart perfect for showing trends over time or categories.',
                category: 'basic',
                tags: ['basic', 'time-series', 'trends'],
                createFunction: 'createLineChart',
                dataFunction: 'generateLineChartData',
                code: `// Line Chart Example
const data = dataGenerator.generateLineChartData(12, 3);
const chart = visualizationLibrary.createLineChart(container, data);`
            },
            {
                id: 'pie-chart',
                title: 'Pie Chart',
                description: 'Traditional pie chart for showing parts of a whole with percentage labels.',
                category: 'basic',
                tags: ['basic', 'proportional', 'categorical'],
                createFunction: 'createPieChart',
                dataFunction: 'generatePieChartData',
                code: `// Pie Chart Example
const data = dataGenerator.generatePieChartData(6);
const chart = visualizationLibrary.createPieChart(container, data);`
            },
            {
                id: 'scatter-plot',
                title: 'Scatter Plot',
                description: 'Interactive scatter plot showing correlations between two variables.',
                category: 'basic',
                tags: ['basic', 'correlation', 'statistical'],
                createFunction: 'createScatterPlot',
                dataFunction: 'generateScatterPlotData',
                code: `// Scatter Plot Example
const data = dataGenerator.generateScatterPlotData(100);
const chart = visualizationLibrary.createScatterPlot(container, data);`
            },
            {
                id: 'area-chart',
                title: 'Area Chart',
                description: 'Stacked area chart for showing cumulative values over time.',
                category: 'basic',
                tags: ['basic', 'time-series', 'cumulative'],
                createFunction: 'createAreaChart',
                dataFunction: 'generateAreaChartData',
                code: `// Area Chart Example
const data = dataGenerator.generateAreaChartData(20, 2);
const chart = visualizationLibrary.createAreaChart(container, data);`
            },
            {
                id: 'donut-chart',
                title: 'Donut Chart',
                description: 'Modern donut chart variation of pie chart with center space for labels.',
                category: 'basic',
                tags: ['basic', 'proportional', 'modern'],
                createFunction: 'createDonutChart',
                dataFunction: 'generatePieChartData',
                code: `// Donut Chart Example
const data = dataGenerator.generatePieChartData(6);
const chart = visualizationLibrary.createDonutChart(container, data);`
            },
            {
                id: 'heatmap',
                title: 'Heatmap',
                description: 'Color-coded heatmap for visualizing patterns in matrix data.',
                category: 'advanced',
                tags: ['advanced', 'matrix', 'patterns'],
                createFunction: 'createHeatmap',
                dataFunction: 'generateHeatmapData',
                code: `// Heatmap Example
const data = dataGenerator.generateHeatmapData(7, 24);
const chart = visualizationLibrary.createHeatmap(container, data);`
            },
            {
                id: 'force-layout',
                title: 'Force-Directed Network',
                description: 'Interactive network diagram with physics-based node positioning.',
                category: 'advanced',
                tags: ['advanced', 'network', 'interactive', 'physics'],
                createFunction: 'createForceLayout',
                dataFunction: 'generateNetworkData',
                code: `// Force Layout Example
const data = dataGenerator.generateNetworkData(20, 30);
const chart = visualizationLibrary.createForceLayout(container, data);`
            },
            {
                id: 'treemap',
                title: 'Treemap',
                description: 'Hierarchical treemap for displaying nested data structures.',
                category: 'advanced',
                tags: ['advanced', 'hierarchical', 'nested'],
                createFunction: 'createTreemap',
                dataFunction: 'generateTreemapData',
                code: `// Treemap Example
const data = dataGenerator.generateTreemapData(3, 5);
const chart = visualizationLibrary.createTreemap(container, data);`
            },
            {
                id: 'bubble-chart',
                title: 'Bubble Chart',
                description: 'Animated bubble chart with force simulation for engaging data display.',
                category: 'interactive',
                tags: ['interactive', 'animated', 'multi-dimensional'],
                createFunction: 'createBubbleChart',
                dataFunction: 'generateBubbleChartData',
                code: `// Bubble Chart Example
const data = dataGenerator.generateBubbleChartData(30);
const chart = visualizationLibrary.createBubbleChart(container, data);`
            }
        ];
    }

    init() {
        this.setupEventListeners();
        this.renderVisualizations();
        this.hideLoading();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.dataset.category);
            });
        });

        // Sidebar category items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.dataset.category);
            });
        });

        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveView(e.target.dataset.view);
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.setSearchTerm(e.target.value);
        });

        // Settings
        const animationSpeed = document.getElementById('animationSpeed');
        animationSpeed.addEventListener('input', (e) => {
            visualizationLibrary.animations.speed = parseFloat(e.target.value);
        });

        const autoPlay = document.getElementById('autoPlay');
        autoPlay.addEventListener('change', (e) => {
            visualizationLibrary.animations.enabled = e.target.checked;
        });

        const showTooltips = document.getElementById('showTooltips');
        showTooltips.addEventListener('change', (e) => {
            visualizationLibrary.tooltips.enabled = e.target.checked;
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Fullscreen toggle
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on background click
        const modal = document.getElementById('visualizationModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update sidebar items
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });

        // Update content title
        const categoryNames = {
            'all': 'All Visualizations',
            'basic': 'Basic Charts',
            'advanced': 'Advanced Visualizations',
            'interactive': 'Interactive Charts',
            'geographic': 'Geographic Visualizations'
        };
        document.getElementById('contentTitle').textContent = categoryNames[category];

        this.filterVisualizations();
        this.renderVisualizations();
    }

    setActiveView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        const grid = document.getElementById('visualizationGrid');
        grid.classList.toggle('list-view', view === 'list');
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase();
        this.filterVisualizations();
        this.renderVisualizations();
    }

    filterVisualizations() {
        this.filteredVisualizations = this.visualizations.filter(viz => {
            const matchesCategory = this.currentCategory === 'all' || viz.category === this.currentCategory;
            const matchesSearch = !this.searchTerm || 
                viz.title.toLowerCase().includes(this.searchTerm) ||
                viz.description.toLowerCase().includes(this.searchTerm) ||
                viz.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });
    }

    renderVisualizations() {
        const grid = document.getElementById('visualizationGrid');
        grid.innerHTML = '';

        this.filteredVisualizations.forEach((viz, index) => {
            const card = this.createVisualizationCard(viz, index);
            grid.appendChild(card);
        });

        // Add staggered animation delay
        setTimeout(() => {
            document.querySelectorAll('.visualization-card').forEach((card, i) => {
                card.style.animationDelay = `${i * 0.1}s`;
            });
        }, 50);
    }

    createVisualizationCard(viz, index) {
        const card = document.createElement('div');
        card.className = 'visualization-card';
        card.onclick = () => this.openModal(viz);

        const categoryColors = {
            'basic': '#3b82f6',
            'advanced': '#8b5cf6',
            'interactive': '#10b981',
            'geographic': '#f59e0b'
        };

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${viz.title}</div>
                <div class="card-category" style="background-color: ${categoryColors[viz.category]}">${viz.category}</div>
            </div>
            <div class="card-visualization" id="preview-${viz.id}">
                <div class="loading-placeholder">Loading...</div>
            </div>
            <div class="card-footer">
                ${viz.description}
            </div>
        `;

        // Generate preview visualization
        setTimeout(() => {
            this.generatePreview(viz, `preview-${viz.id}`);
        }, index * 100);

        return card;
    }

    generatePreview(viz, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        try {
            // Generate data using the specified data function
            const data = dataGenerator[viz.dataFunction]();
            
            // Create visualization using the specified create function
            visualizationLibrary[viz.createFunction](container, data);
        } catch (error) {
            console.error(`Error generating preview for ${viz.id}:`, error);
            container.innerHTML = '<div style="color: #ef4444;">Preview unavailable</div>';
        }
    }

    openModal(viz) {
        const modal = document.getElementById('visualizationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalVisualization = document.getElementById('modalVisualization');
        const modalDescription = document.getElementById('modalDescription');
        const modalCode = document.getElementById('modalCode');
        const modalData = document.getElementById('modalData');

        modalTitle.textContent = viz.title;
        modalDescription.textContent = viz.description;
        modalCode.textContent = viz.code;
        modalVisualization.innerHTML = '';

        // Generate full-size visualization
        try {
            const data = dataGenerator[viz.dataFunction]();
            modalData.textContent = JSON.stringify(data, null, 2);
            
            // Temporarily disable animations for modal
            const originalAnimationsEnabled = visualizationLibrary.animations.enabled;
            visualizationLibrary.animations.enabled = false;
            
            visualizationLibrary[viz.createFunction](modalVisualization, data);
            
            // Restore animation settings
            visualizationLibrary.animations.enabled = originalAnimationsEnabled;
        } catch (error) {
            console.error(`Error generating modal visualization for ${viz.id}:`, error);
            modalVisualization.innerHTML = '<div style="color: #ef4444;">Visualization unavailable</div>';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('visualizationModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Store preference
        localStorage.setItem('theme', newTheme);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1000);
    }

    // Initialize theme from localStorage
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            const themeIcon = document.querySelector('.theme-toggle i');
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Responsive sidebar toggle for mobile
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }
}

// Initialize the showcase app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.showcaseApp = new ShowcaseApp();
    
    // Initialize theme
    showcaseApp.initializeTheme();
    
    // Add mobile sidebar toggle if needed
    if (window.innerWidth <= 1024) {
        const header = document.querySelector('.header-content');
        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.onclick = () => showcaseApp.toggleSidebar();
        header.insertBefore(menuBtn, header.firstChild);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Re-render visualizations if needed
    if (window.showcaseApp) {
        setTimeout(() => {
            showcaseApp.renderVisualizations();
        }, 300);
    }
});