'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const console = require('./logger');

module.exports = (root, port) => {
  http.createServer(async (req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(root, url);
    try {
      const data = await fs.promises.readFile(filePath);
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.end('"File is not found"');
    }
  }).listen(port);

  console.log(`Static server was running on port ${port}`);
};
