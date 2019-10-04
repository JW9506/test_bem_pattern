const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    App: "./app/assets/scripts/App.js",
    Vendor: "./app/assets/scripts/Vendor.js"
  },
  output: {
    path: path.resolve(__dirname, "app/temp/scripts"),
    filename: "[name].js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        // Can be put into use: []
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "entry",
                targets: "> 0.25%, not dead",
                corejs: {
                  version: 2,
                  proposals: true
                }
              }
            ]
          ]
        }
      }
    ]
  }
};
