const path = require('path');
const dir  = __dirname;

module.exports = {
  apps: [
    {
      name:     'tinaai',
      script:   path.join(dir, 'bot.js'),
      env_file: path.join(dir, '.env'),
      watch:    false,
    },
    {
      name:     'tinaai-web',
      script:   path.join(dir, 'server.js'),
      env_file: path.join(dir, '.env'),
      watch:    false,
    },
  ],
};
