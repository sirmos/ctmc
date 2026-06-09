module.exports = {
  apps: [{
    name: 'ctmc-api',
    script: 'server/index.js',
    env: { NODE_ENV: 'production', PORT: 3001 }
  }]
};
