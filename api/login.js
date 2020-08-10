var express = require('express');
var http = require('http');

var handleError = require('../utils/handleError.js');
var spotifyCredentials = require('../secrets.js');

var router = express.Router();

/* GET credentials for authRequest() */
router.get('/get_credentials', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  
  res.status(200).json(spotifyCredentials);
})

/* GET auth request */
router.get('/auth_request', function(req, res, next) {
  var scopes = 'playlist-read-private playlist-modify-public playlist-modify-private user-library-read user-library-modify user-top-read streaming user-read-playback-state user-modify-playback-state';

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.status(200).json('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI)
  );
})

/* redirect from auth_request: GET tokens from Spotify. */
router.get('/redirect', function(req, res, next) {
  const auth_code = req.query.code;
  console.log(auth_code)
  res.status(200).json(auth_code);
});

module.exports = router;
