# Data Visualization Studio

A modern, interactive web application for selecting data sources and creating beautiful visualizations using D3.js.

## 🌟 Features

### Data Sources
- **Sample Data**: Pre-loaded datasets for quick exploration
  - Sales data, weather data, stock market data, demographics, energy consumption
- **CSV Upload**: Upload your own CSV files
- **JSON Upload**: Upload JSON data files  
- **API Integration**: Fetch data from REST APIs

### Visualization Types
- **Bar Charts**: Perfect for categorical data comparisons
- **Line Charts**: Great for time series and trend analysis
- **Pie Charts**: Ideal for showing proportions and percentages
- **Scatter Plots**: Excellent for correlation analysis
- **Area Charts**: Beautiful for showing data over time
- **Heatmaps**: Perfect for showing patterns in multi-dimensional data

### User Experience
- **Modern UI**: Clean, intuitive interface with professional design
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Charts**: Hover effects, tooltips, and smooth animations
- **Real-time Updates**: Charts update instantly when changing parameters
- **Export Functionality**: Download visualizations as PNG images

### Configuration Options
- **Dynamic Column Selection**: Automatically detect and select appropriate X/Y axes
- **Color Schemes**: Multiple color palettes including Viridis, Plasma, Inferno, Turbo
- **Data Preview**: View your data in a table format before visualizing
- **Smart Defaults**: Intelligent auto-selection of chart types based on data types

## 🚀 Quick Start

### Prerequisites
- Node.js (version 12 or higher)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

1. **Start the server**:
   ```bash
   node serve.js
   ```

2. **Open in browser**:
   Navigate to `http://localhost:3000`

3. **Start visualizing**:
   - Click "Sample Data" to explore pre-loaded datasets
   - Or upload your own CSV/JSON files
   - Or connect to an API endpoint

## 📊 How to Use

### Getting Started with Sample Data
1. Click on "Sample Data" in the sidebar
2. Choose from available datasets (Sales, Weather, Stocks, etc.)
3. The data will load automatically with smart column detection
4. Select your preferred chart type
5. Customize X-axis, Y-axis, and color scheme
6. Export your visualization when ready

### Uploading Your Own Data

#### CSV Files
- Ensure your CSV has headers in the first row
- Numeric data will be automatically detected
- Date formats: YYYY-MM-DD, MM/DD/YYYY, or month names

#### JSON Files
- Should be an array of objects with consistent properties
- Example format:
  ```json
  [
    {"name": "Product A", "sales": 100, "region": "North"},
    {"name": "Product B", "sales": 150, "region": "South"}
  ]
  ```

#### API Integration
- Enter a REST API URL that returns JSON data
- Ensure the API supports CORS or is properly configured
- The response should be an array of objects

### Chart Selection Tips
- **Bar Charts**: Use when X-axis is categorical and Y-axis is numeric
- **Line/Area Charts**: Best for time series data or ordered categories
- **Pie Charts**: Use when showing parts of a whole (ensure Y-axis represents values to sum)
- **Scatter Plots**: Perfect when both X and Y axes are numeric
- **Heatmaps**: Great for showing relationships between two categorical variables

## 🎨 Customization

### Themes
- **Light Theme**: Professional and clean for presentations
- **Dark Theme**: Easy on the eyes for extended use
- Theme preference is saved automatically

### Color Schemes
- **Category 10**: Default discrete colors for categorical data
- **Viridis**: Perceptually uniform, colorblind-friendly
- **Plasma**: High contrast, good for emphasis
- **Inferno**: Warm colors, excellent for heatmaps
- **Turbo**: Wide range, good for large datasets

## 📱 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design supports mobile viewing

## 🛠️ Technical Details

### Built With
- **D3.js v7**: Powerful data visualization library
- **Vanilla JavaScript**: No framework dependencies for maximum performance
- **CSS Custom Properties**: Modern styling with theme support
- **ES6 Modules**: Clean, modular code architecture
- **Node.js**: Simple static file server

### File Structure
```
├── index.html          # Main application page
├── styles.css          # Comprehensive styling
├── visualization.js    # Main application logic
├── sample-data.js      # Sample datasets and utilities
├── serve.js           # Simple HTTP server
└── README-website.md  # This documentation
```

### Performance Optimizations
- Efficient D3.js rendering with proper enter/update/exit patterns
- Optimized CSS with hardware-accelerated animations
- Lazy loading of large datasets
- Responsive image export

## 🔧 Advanced Usage

### Adding Custom Datasets
Edit `sample-data.js` to add your own sample datasets:

```javascript
export const sampleDatasets = {
  myCustomData: {
    name: "My Custom Dataset",
    description: "Description of my data",
    data: [
      // Your data objects here
    ]
  }
};
```

### Extending Chart Types
The application is designed to be extensible. To add new chart types:

1. Add a new option in the HTML chart types section
2. Implement the rendering function in `visualization.js`
3. Add the new chart type to the switch statement in `renderChart()`

## 📈 Use Cases

- **Business Analytics**: Sales performance, KPI dashboards
- **Research**: Scientific data exploration and presentation
- **Education**: Teaching data visualization concepts
- **Marketing**: Campaign performance and audience analysis
- **Finance**: Stock analysis, portfolio visualization
- **Operations**: Performance monitoring, trend analysis

## 🤝 Contributing

This is a standalone application built for educational and professional use. Feel free to modify and extend it for your specific needs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Happy Visualizing!** 📊✨