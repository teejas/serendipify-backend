const express = require('express');
const axios = require('axios')

const handleError = require('../utils/handleError.js');

const router = express.Router();

/* POST auth_request: body contains redirect_uri */
router.post('/auth_request', function(req, res, next) {
  try {
    var redirect_uri = req.body.redirect_uri;

    console.log(redirect_uri)

    if(redirect_uri) {

      const scopes = 'playlist-read-private playlist-modify-public playlist-modify-private user-library-read user-library-modify user-top-read streaming user-read-playback-state user-modify-playback-state';

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");

      res.status(200).json('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + spotifyCredentials.CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri)
      );
    } else {
      const msg = "No redirect uri for /auth_request...";
      handleError(res, msg, msg, 500);
    }
  } catch(error) {
    const msg = "Error with /auth_request endpoint...";
    handleError(res, error, msg, 500);
  }
})

/* POST get_tokens: body contains auth_code */
router.post('/get_tokens', function(req, res, next) {
  try {
    var code = req.body.auth_code;
    var redirect_uri = req.body.redirect_uri;

    console.log(redirect_uri);

    // make call to spotify api
    var creds = `${spotifyCredentials.CLIENT_ID}:${spotifyCredentials.CLIENT_SECRET}`;
    var creds_base64 = Buffer.from(creds).toString('base64');

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`;
    const config = {
      headers: {
        Authorization: `Basic ${creds_base64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('https://accounts.spotify.com/api/token', body, config)
      .then((tokens_res) => {
        console.log('Body: ', tokens_res.data);
        res.status(200).json(tokens_res.data);
      }).catch((error) => {
        const msg = "Error with POST request to spotify API for /get_tokens...";
        handleError(res, error, msg, 500);
      });
  } catch(error) {
    const msg = "Error with /get_tokens endpoint...";
    handleError(res, error, msg, 500);
  }
})

/* POST refresh_token: body contains refresh_token */
router.post('/refresh_tokens', function(req, res, next) {
  const refresh_token = req.body.refresh_token;

  // make call to spotify api
  const creds = `${spotifyCredentials.CLIENT_ID}:${spotifyCredentials.CLIENT_SECRET}`;
  const creds_base64 = Buffer.from(creds).toString('base64');

  const body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
  const config = {
    headers: {
      Authorization: `Basic ${creds_base64}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  axios.post('https://accounts.spotify.com/api/token', body, config)
  .then((tokens_res) => {
    console.log('Body: ', tokens_res.data);
    res.status(200).json(tokens_res.data);
  }).catch((err) => {
    const msg = "Error with POST request to spotify API for /refresh_tokens..."
    handleError(res, err, msg, 500);
  });
})

module.exports = router;
