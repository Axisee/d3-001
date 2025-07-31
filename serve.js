const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Data Visualization Studio is running at:`);
    console.log(`🌐 http://localhost:${port}`);
    console.log(`\nFeatures available:`);
    console.log(`📊 Multiple chart types (Bar, Line, Pie, Scatter, Area, Heatmap)`);
    console.log(`📁 Data source options (Sample data, CSV upload, JSON upload, API)`);
    console.log(`🎨 Multiple color schemes and themes`);
    console.log(`📱 Responsive design`);
    console.log(`💾 Export functionality`);
    console.log(`\nPress Ctrl+C to stop the server`);
});