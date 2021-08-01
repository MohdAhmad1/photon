const WindiCSS = require("windicss-webpack-plugin").default;

module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.plugins.push(new WindiCSS());
    return config;
  },

  images: {
    domains: ["images.unsplash.com", "deelay.me", "picsum.photos"],
  },

  devIndicators: {
    autoPrerender: true,
  },
};
