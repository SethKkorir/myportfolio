// Quick script to register admin user
const http = require('http');

const data = JSON.stringify({
    email: "admin@sethkorir.com",
    password: "Admin123!",
    registrationSecret: "kipchumba"
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${body}`);
    });
});

req.on('error', (e) => console.error(`Error: ${e.message}`));
req.write(data);
req.end();
