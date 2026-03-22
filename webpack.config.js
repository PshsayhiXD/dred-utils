import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  mode: "production",
  entry: {
    content: "./content.js",
    plugins: "./utils/pluginLoader.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  }
};