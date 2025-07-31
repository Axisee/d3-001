// Sample data for demonstration purposes

export const sampleDatasets = {
    sales: {
        name: "Monthly Sales Data",
        description: "Sales performance across different products and months",
        data: [
            { month: "Jan", product: "Laptops", sales: 120, revenue: 144000, region: "North" },
            { month: "Jan", product: "Phones", sales: 200, revenue: 120000, region: "North" },
            { month: "Jan", product: "Tablets", sales: 80, revenue: 40000, region: "North" },
            { month: "Feb", product: "Laptops", sales: 135, revenue: 162000, region: "North" },
            { month: "Feb", product: "Phones", sales: 180, revenue: 108000, region: "North" },
            { month: "Feb", product: "Tablets", sales: 95, revenue: 47500, region: "North" },
            { month: "Mar", product: "Laptops", sales: 150, revenue: 180000, region: "North" },
            { month: "Mar", product: "Phones", sales: 220, revenue: 132000, region: "North" },
            { month: "Mar", product: "Tablets", sales: 110, revenue: 55000, region: "North" },
            { month: "Apr", product: "Laptops", sales: 140, revenue: 168000, region: "South" },
            { month: "Apr", product: "Phones", sales: 240, revenue: 144000, region: "South" },
            { month: "Apr", product: "Tablets", sales: 125, revenue: 62500, region: "South" },
            { month: "May", product: "Laptops", sales: 165, revenue: 198000, region: "South" },
            { month: "May", product: "Phones", sales: 210, revenue: 126000, region: "South" },
            { month: "May", product: "Tablets", sales: 140, revenue: 70000, region: "South" },
            { month: "Jun", product: "Laptops", sales: 175, revenue: 210000, region: "South" },
            { month: "Jun", product: "Phones", sales: 260, revenue: 156000, region: "South" },
            { month: "Jun", product: "Tablets", sales: 155, revenue: 77500, region: "South" }
        ]
    },

    weather: {
        name: "Weather Data",
        description: "Temperature and precipitation data for major cities",
        data: [
            { city: "New York", month: "Jan", temperature: 2, precipitation: 84, humidity: 65 },
            { city: "New York", month: "Feb", temperature: 4, precipitation: 76, humidity: 63 },
            { city: "New York", month: "Mar", temperature: 9, precipitation: 91, humidity: 64 },
            { city: "New York", month: "Apr", temperature: 15, precipitation: 99, humidity: 66 },
            { city: "New York", month: "May", temperature: 20, precipitation: 106, humidity: 69 },
            { city: "New York", month: "Jun", temperature: 25, precipitation: 112, humidity: 71 },
            { city: "Los Angeles", month: "Jan", temperature: 15, precipitation: 79, humidity: 68 },
            { city: "Los Angeles", month: "Feb", temperature: 16, precipitation: 76, humidity: 70 },
            { city: "Los Angeles", month: "Mar", temperature: 17, precipitation: 65, humidity: 72 },
            { city: "Los Angeles", month: "Apr", temperature: 19, precipitation: 24, humidity: 70 },
            { city: "Los Angeles", month: "May", temperature: 21, precipitation: 6, humidity: 72 },
            { city: "Los Angeles", month: "Jun", temperature: 23, precipitation: 2, humidity: 74 },
            { city: "Chicago", month: "Jan", temperature: -4, precipitation: 51, humidity: 74 },
            { city: "Chicago", month: "Feb", temperature: -1, precipitation: 48, humidity: 73 },
            { city: "Chicago", month: "Mar", temperature: 6, precipitation: 65, humidity: 71 },
            { city: "Chicago", month: "Apr", temperature: 12, precipitation: 91, humidity: 68 },
            { city: "Chicago", month: "May", temperature: 18, precipitation: 99, humidity: 70 },
            { city: "Chicago", month: "Jun", temperature: 24, precipitation: 84, humidity: 72 }
        ]
    },

    stocks: {
        name: "Stock Market Data",
        description: "Daily stock prices for tech companies",
        data: [
            { date: "2024-01-01", company: "AAPL", price: 185.92, volume: 52465200, sector: "Technology" },
            { date: "2024-01-02", company: "AAPL", price: 187.15, volume: 54012300, sector: "Technology" },
            { date: "2024-01-03", company: "AAPL", price: 184.25, volume: 48921100, sector: "Technology" },
            { date: "2024-01-04", company: "AAPL", price: 186.78, volume: 51234600, sector: "Technology" },
            { date: "2024-01-05", company: "AAPL", price: 189.42, volume: 55678900, sector: "Technology" },
            { date: "2024-01-01", company: "GOOGL", price: 142.65, volume: 28765400, sector: "Technology" },
            { date: "2024-01-02", company: "GOOGL", price: 144.12, volume: 29876500, sector: "Technology" },
            { date: "2024-01-03", company: "GOOGL", price: 141.89, volume: 27654300, sector: "Technology" },
            { date: "2024-01-04", company: "GOOGL", price: 143.56, volume: 30123400, sector: "Technology" },
            { date: "2024-01-05", company: "GOOGL", price: 145.78, volume: 31245600, sector: "Technology" },
            { date: "2024-01-01", company: "MSFT", price: 376.04, volume: 23456700, sector: "Technology" },
            { date: "2024-01-02", company: "MSFT", price: 378.92, volume: 24567800, sector: "Technology" },
            { date: "2024-01-03", company: "MSFT", price: 374.58, volume: 22345600, sector: "Technology" },
            { date: "2024-01-04", company: "MSFT", price: 377.33, volume: 25678900, sector: "Technology" },
            { date: "2024-01-05", company: "MSFT", price: 380.15, volume: 26789000, sector: "Technology" }
        ]
    },

    demographics: {
        name: "Population Demographics",
        description: "Age distribution across different regions",
        data: [
            { region: "North America", ageGroup: "0-18", population: 75000000, percentage: 20.2 },
            { region: "North America", ageGroup: "19-35", population: 89000000, percentage: 24.0 },
            { region: "North America", ageGroup: "36-50", population: 82000000, percentage: 22.1 },
            { region: "North America", ageGroup: "51-65", population: 78000000, percentage: 21.0 },
            { region: "North America", ageGroup: "65+", population: 47000000, percentage: 12.7 },
            { region: "Europe", ageGroup: "0-18", population: 82000000, percentage: 17.5 },
            { region: "Europe", ageGroup: "19-35", population: 95000000, percentage: 20.3 },
            { region: "Europe", ageGroup: "36-50", population: 105000000, percentage: 22.4 },
            { region: "Europe", ageGroup: "51-65", population: 98000000, percentage: 20.9 },
            { region: "Europe", ageGroup: "65+", population: 89000000, percentage: 19.0 },
            { region: "Asia", ageGroup: "0-18", population: 1200000000, percentage: 26.8 },
            { region: "Asia", ageGroup: "19-35", population: 1350000000, percentage: 30.1 },
            { region: "Asia", ageGroup: "36-50", population: 980000000, percentage: 21.9 },
            { region: "Asia", ageGroup: "51-65", population: 650000000, percentage: 14.5 },
            { region: "Asia", ageGroup: "65+", population: 300000000, percentage: 6.7 }
        ]
    },

    energy: {
        name: "Energy Consumption",
        description: "Energy consumption by source and country",
        data: [
            { country: "USA", source: "Coal", consumption: 1245, year: 2023, renewable: false },
            { country: "USA", source: "Natural Gas", consumption: 1678, year: 2023, renewable: false },
            { country: "USA", source: "Nuclear", consumption: 843, year: 2023, renewable: false },
            { country: "USA", source: "Hydro", consumption: 254, year: 2023, renewable: true },
            { country: "USA", source: "Wind", consumption: 387, year: 2023, renewable: true },
            { country: "USA", source: "Solar", consumption: 156, year: 2023, renewable: true },
            { country: "China", source: "Coal", consumption: 3856, year: 2023, renewable: false },
            { country: "China", source: "Natural Gas", consumption: 456, year: 2023, renewable: false },
            { country: "China", source: "Nuclear", consumption: 287, year: 2023, renewable: false },
            { country: "China", source: "Hydro", consumption: 1398, year: 2023, renewable: true },
            { country: "China", source: "Wind", consumption: 465, year: 2023, renewable: true },
            { country: "China", source: "Solar", consumption: 287, year: 2023, renewable: true },
            { country: "Germany", source: "Coal", consumption: 198, year: 2023, renewable: false },
            { country: "Germany", source: "Natural Gas", consumption: 287, year: 2023, renewable: false },
            { country: "Germany", source: "Nuclear", consumption: 76, year: 2023, renewable: false },
            { country: "Germany", source: "Hydro", consumption: 28, year: 2023, renewable: true },
            { country: "Germany", source: "Wind", consumption: 154, year: 2023, renewable: true },
            { country: "Germany", source: "Solar", consumption: 67, year: 2023, renewable: true }
        ]
    }
};

// Helper function to get column information from data
export function getColumns(data) {
    if (!data || data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).map(key => ({
        name: key,
        type: getColumnType(data, key),
        values: [...new Set(data.map(d => d[key]))].slice(0, 10) // Sample unique values
    }));
}

// Helper function to determine column type
export function getColumnType(data, column) {
    const sample = data[0][column];
    
    if (typeof sample === 'number') {
        return 'numeric';
    } else if (typeof sample === 'string') {
        // Check if it's a date
        if (isValidDate(sample)) {
            return 'date';
        }
        return 'categorical';
    } else if (typeof sample === 'boolean') {
        return 'boolean';
    }
    
    return 'text';
}

// Helper function to check if string is a valid date
function isValidDate(dateString) {
    const datePatterns = [
        /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i // Month names
    ];
    
    return datePatterns.some(pattern => pattern.test(dateString));
}

// Function to get suggested chart types based on data
export function getSuggestedCharts(xColumn, yColumn, data) {
    if (!xColumn || !yColumn || !data) return [];
    
    const xType = getColumnType(data, xColumn);
    const yType = getColumnType(data, yColumn);
    
    const suggestions = [];
    
    if (xType === 'categorical' && yType === 'numeric') {
        suggestions.push('bar', 'pie');
    }
    
    if ((xType === 'date' || xType === 'numeric') && yType === 'numeric') {
        suggestions.push('line', 'area', 'scatter');
    }
    
    if (xType === 'numeric' && yType === 'numeric') {
        suggestions.push('scatter', 'heatmap');
    }
    
    return suggestions;
}