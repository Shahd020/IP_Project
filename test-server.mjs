import { createServer } from 'http';

const server = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
    res.end(`<!DOCTYPE html>
<html>
<body>
  <div id="root">Loading...</div>
  <script type="module">
    import { msg } from '/module.js';
    document.getElementById('root').textContent = msg;
  </script>
</body>
</html>`);
  } else if (req.url === '/module.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
    res.end(`export const msg = "ES modules work!";`);
  }
});

server.listen(9999, '127.0.0.1', () => {
  console.log('Test server at http://127.0.0.1:9999/');
});
