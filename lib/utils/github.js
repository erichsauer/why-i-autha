const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
  const res = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${code}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  );
  const { access_token } = await res.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` },
  });
  const user = res.json();
  return user;
};

module.exports = { exchangeCodeForToken, getGithubProfile };
