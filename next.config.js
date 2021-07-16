const WindiCSS = require("windicss-webpack-plugin").default;

module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.plugins.push(new WindiCSS());
    return config;
  },
};
