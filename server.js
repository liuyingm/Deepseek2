const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config');
let fetch;
(async () => {
    const { default: f } = await import('node-fetch');
    fetch = f;
})();

const PORT = 3000;
const API_KEY = config.API_KEY;
const API_URL = config.API_URL;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};

const server = http.createServer(async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理API请求
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const apiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-r1-250120',
                        messages: data.messages
                    })
                });

                const result = await apiResponse.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // 处理静态文件
    let filePath = req.url === '/' ? 'index.html' : req.url.substring(1);
    filePath = path.join(__dirname, filePath);

    try {
        const content = await fs.promises.readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(content);
    } catch (error) {
        res.writeHead(404);
        res.end('File not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
