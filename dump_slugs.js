// Temp script to dump all product slugs and images
const http = require('http');

// Fetch the products page HTML and extract product data
http.get('http://localhost:3000/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Look for slug patterns in the HTML
    const slugs = [...data.matchAll(/\/products\/([a-z0-9-]+)/g)].map(m => m[1]);
    const unique = [...new Set(slugs)].filter(s => !s.includes('.'));
    unique.sort();
    unique.forEach(s => console.log(s));
  });
}).on('error', e => console.error(e));
