import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  mode: "production",
  //devtool: "cheap-module-source-map",
  entry: {
    content: "./content.js",
    popup: "./popup/popup.js",
    content_plugin: "./utils/plugins.js",
    page_plugin: "./utils/pluginLoader.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  }
};