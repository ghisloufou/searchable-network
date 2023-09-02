import packageJson from "./package.json";

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    "128": "icon-128.png",
    "34": "icon-34.png",
  },
  devtools_page: "src/pages/devtools/index.html",
  permissions: ["storage"],
  background: {
    service_worker: "src/serviceWorker/index.js",
    type: "module",
  },
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
