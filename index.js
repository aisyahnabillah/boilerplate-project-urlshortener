require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url');
const bodyParser = require('body-parser');
const shortid = require('shortid');

// Basic Configuration
const port = process.env.PORT || 3000;

// Set up body-parser to handle POST request data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Keep track of shortened URLs in memory
const urls = {};

// POST endpoint to create a new short URL
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;
  if (validUrl.isWebUri(url)) {
    const shortCode = shortid.generate();
    urls[shortCode] = url;
    res.json({
      original_url: url,
      short_url: shortCode
    });
  } else {
    res.json({
      error: 'invalid url'
    });
  }
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:code', function(req, res) {
  const { code } = req.params;
  const url = urls[code];
  if (url) {
    res.redirect(url);
  } else {
    res.json({
      error: 'invalid short code'
    });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
