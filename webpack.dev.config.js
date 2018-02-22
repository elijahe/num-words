const webpackConfig = require("./webpack.config");

webpackConfig.devtool = "sourcemaps";
webpackConfig.plugins = [];

module.exports = webpackConfig;
