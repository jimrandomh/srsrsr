import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express()
const port = 5000

const projectRoot = path.join(__dirname, '..');
const staticFilesPath = path.join(projectRoot, 'static');
console.log(`Serving static files from ${staticFilesPath}`);

app.use('/static', express.static(staticFilesPath))
app.use('/', express.static(path.join(projectRoot, 'index.html')));

app.get('/', async (req, res) => {
  const indexFile = await fs.readFileSync(path.join(projectRoot,'static/index.html'));
  res.writeHead(200);
  res.end(indexFile);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})