const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res) => {
    // TODO:
    // get code
    const { code } = req.query;
    // exchange code for token
    const token = await exchangeCodeForToken(code);
    // get info from github about user with token
    const profile = await getGithubProfile(token);
    // get existing user if there is one
    const user =
      (await GithubUser.findByUsername(profile)) ??
      // if not, create one
      (await GithubUser.insert(profile));
    // create jwt
    const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    // set cookie and redirect
    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('http://localhost:7891');
    // .json(user);
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    if (!req.user) throw new Error('you must be signed in to continue');
    // get data about user and send it as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
