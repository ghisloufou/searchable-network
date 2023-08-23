// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve as resolve3, parse } from "path";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m",
};

// utils/manifest-parser/index.ts
var ManifestParser = class {
  constructor() {}
  static convertManifestToString(manifest2) {
    return JSON.stringify(manifest2, null, 2);
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname =
  "C:\\Users\\gferraro031722\\dev\\better-better-network-panel\\utils\\plugins";
var { resolve } = path;
var outDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
function makeManifest(manifest2) {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      const manifestPath = resolve(outDir, "manifest.json");
      fs.writeFileSync(
        manifestPath,
        manifest_parser_default.convertManifestToString(manifest2),
      );
      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    },
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport() {
      return {
        left: `
        {
          const dynamicImport = (path) => import(path);
          dynamicImport(
          `,
        right: ")}",
      };
    },
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname2 =
  "C:\\Users\\gferraro031722\\dev\\better-better-network-panel\\utils\\plugins";
var isDev = process.env.__DEV__ === "true";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(
    path2.resolve(
      __vite_injected_original_dirname2,
      "..",
      "reload",
      "injections",
      fileName,
    ),
    { encoding: "utf8" },
  );
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    },
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// package.json
var package_default = {
  name: "better-better-network-panel",
  version: "0.0.2",
  description:
    "A chrome extension to better search in the network payloads and responses",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/ghisloufou/better-better-network-panel.git",
  },
  scripts: {
    build: "tsc --noEmit && vite build",
    buildw: "vite build -w",
    typew: "tsc --noEmit -w --pretty",
    "build:hmr": "rollup --config utils/reload/rollup.config.ts",
    wss: "node utils/reload/initReloadServer.js",
    dev: "yarn build:hmr && (yarn wss & nodemon)",
    devp: "pnpm build:hmr && (pnpm wss & nodemon)",
    test: "jest",
    start:
      'concurrently -n dev,typew,buildw "yarn dev" "yarn typew" "yarn buildw"',
    startp:
      'concurrently -n dev,typew,buildw "pnpm devp" "pnpm typew" "pnpm buildw"',
  },
  type: "module",
  dependencies: {
    "@popperjs/core": "^2.11.6",
    bootstrap: "^5.2.2",
    jsoneditor: "^9.9.2",
    react: "18.2.0",
    "react-dom": "18.2.0",
    uuid: "^9.0.0",
    "vanilla-jsoneditor": "^0.7.11",
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/chrome": "0.0.197",
    "@types/jest": "29.0.3",
    "@types/jsoneditor": "^9.9.0",
    "@types/node": "18.7.23",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.0.6",
    "@types/uuid": "^8.3.4",
    "@types/ws": "^8.5.3",
    "@typescript-eslint/eslint-plugin": "5.38.1",
    "@typescript-eslint/parser": "5.38.1",
    "@vitejs/plugin-react": "2.1.0",
    chokidar: "^3.5.3",
    concurrently: "^7.5.0",
    eslint: "8.24.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "4.2.1",
    "eslint-plugin-react": "7.31.8",
    "fs-extra": "10.1.0",
    jest: "29.0.3",
    "jest-environment-jsdom": "29.0.3",
    nodemon: "2.0.20",
    prettier: "2.7.1",
    rollup: "2.79.1",
    sass: "^1.55.0",
    "ts-jest": "29.0.2",
    "ts-loader": "9.4.1",
    typescript: "4.8.3",
    vite: "3.1.3",
    ws: "8.9.0",
  },
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: package_default.name,
  version: package_default.version,
  description: package_default.description,
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  icons: {
    128: "icon-128.png",
  },
  devtools_page: "src/pages/devtools/index.html",
  permissions: ["storage"],
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
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname3 =
  "C:\\Users\\gferraro031722\\dev\\better-better-network-panel";
var root = resolve3(__vite_injected_original_dirname3, "src");
var root2 = resolve3(__vite_injected_original_dirname3, "dist");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var bootstrapDir = resolve3(
  __vite_injected_original_dirname3,
  "node_modules/bootstrap",
);
var outDir2 = resolve3(__vite_injected_original_dirname3, "dist");
var publicDir = resolve3(__vite_injected_original_dirname3, "public");
var isDev2 = process.env.__DEV__ === "true";
var enableHmrInBackgroundScript = true;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@ddd": root2,
      "@assets": assetsDir,
      "@pages": pagesDir,
      "@bootstrap": bootstrapDir,
    },
  },
  plugins: [
    react(),
    makeManifest(manifest_default),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
  ],
  publicDir,
  build: {
    outDir: outDir2,
    sourcemap: isDev2,
    rollupOptions: {
      input: {
        devtools: resolve3(pagesDir, "devtools", "index.html"),
        panel: resolve3(pagesDir, "panel", "index.html"),
        content: resolve3(pagesDir, "content", "index.ts"),
        background: resolve3(pagesDir, "background", "index.ts"),
        contentStyle: resolve3(pagesDir, "content", "style.scss"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        options: resolve3(pagesDir, "options", "index.html"),
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev2
          ? "assets/js/[name].js"
          : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = parse(assetInfo.name);
          const assetFolder = getLastElement(dir.split("/"));
          const name = assetFolder + firstUpperCase(_name);
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});
function getLastElement(array) {
  const length = array.length;
  const lastIndex = length - 1;
  return array[lastIndex];
}
function firstUpperCase(str) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgIm1hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ2ZlcnJhcm8wMzE3MjJcXFxcZGV2XFxcXGJldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ2ZlcnJhcm8wMzE3MjJcXFxcZGV2XFxcXGJldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ2ZlcnJhcm8wMzE3MjIvZGV2L2JldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgeyByZXNvbHZlLCBwYXJzZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgbWFrZU1hbmlmZXN0IGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdFwiO1xuaW1wb3J0IGN1c3RvbUR5bmFtaWNJbXBvcnQgZnJvbSBcIi4vdXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnRcIjtcbmltcG9ydCBhZGRIbXIgZnJvbSBcIi4vdXRpbHMvcGx1Z2lucy9hZGQtaG1yXCI7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3RcIjtcblxuY29uc3Qgcm9vdCA9IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcbmNvbnN0IHJvb3QyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbmNvbnN0IHBhZ2VzRGlyID0gcmVzb2x2ZShyb290LCBcInBhZ2VzXCIpO1xuY29uc3QgYXNzZXRzRGlyID0gcmVzb2x2ZShyb290LCBcImFzc2V0c1wiKTtcbmNvbnN0IGJvb3RzdHJhcERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIm5vZGVfbW9kdWxlcy9ib290c3RyYXBcIik7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljXCIpO1xuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09IFwidHJ1ZVwiO1xuXG4vLyBFTkFCTEUgSE1SIElOIEJBQ0tHUk9VTkQgU0NSSVBUXG5jb25zdCBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQgPSB0cnVlO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQHNyY1wiOiByb290LFxuICAgICAgXCJAZGRkXCI6IHJvb3QyLFxuICAgICAgXCJAYXNzZXRzXCI6IGFzc2V0c0RpcixcbiAgICAgIFwiQHBhZ2VzXCI6IHBhZ2VzRGlyLFxuICAgICAgXCJAYm9vdHN0cmFwXCI6IGJvb3RzdHJhcERpcixcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QpLFxuICAgIGN1c3RvbUR5bmFtaWNJbXBvcnQoKSxcbiAgICBhZGRIbXIoeyBiYWNrZ3JvdW5kOiBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQsIHZpZXc6IHRydWUgfSksXG4gIF0sXG4gIHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgc291cmNlbWFwOiBpc0RldixcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBkZXZ0b29sczogcmVzb2x2ZShwYWdlc0RpciwgXCJkZXZ0b29sc1wiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIHBhbmVsOiByZXNvbHZlKHBhZ2VzRGlyLCBcInBhbmVsXCIsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgICAgY29udGVudDogcmVzb2x2ZShwYWdlc0RpciwgXCJjb250ZW50XCIsIFwiaW5kZXgudHNcIiksXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUocGFnZXNEaXIsIFwiYmFja2dyb3VuZFwiLCBcImluZGV4LnRzXCIpLFxuICAgICAgICBjb250ZW50U3R5bGU6IHJlc29sdmUocGFnZXNEaXIsIFwiY29udGVudFwiLCBcInN0eWxlLnNjc3NcIiksXG4gICAgICAgIHBvcHVwOiByZXNvbHZlKHBhZ2VzRGlyLCBcInBvcHVwXCIsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgICAgbmV3dGFiOiByZXNvbHZlKHBhZ2VzRGlyLCBcIm5ld3RhYlwiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIG9wdGlvbnM6IHJlc29sdmUocGFnZXNEaXIsIFwib3B0aW9uc1wiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcInNyYy9wYWdlcy9bbmFtZV0vaW5kZXguanNcIixcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGlzRGV2XG4gICAgICAgICAgPyBcImFzc2V0cy9qcy9bbmFtZV0uanNcIlxuICAgICAgICAgIDogXCJhc3NldHMvanMvW25hbWVdLltoYXNoXS5qc1wiLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgZGlyLCBuYW1lOiBfbmFtZSB9ID0gcGFyc2UoYXNzZXRJbmZvLm5hbWUpO1xuICAgICAgICAgIGNvbnN0IGFzc2V0Rm9sZGVyID0gZ2V0TGFzdEVsZW1lbnQoZGlyLnNwbGl0KFwiL1wiKSk7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IGFzc2V0Rm9sZGVyICsgZmlyc3RVcHBlckNhc2UoX25hbWUpO1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tleHRdLyR7bmFtZX0uY2h1bmsuW2V4dF1gO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmZ1bmN0aW9uIGdldExhc3RFbGVtZW50PFQ+KGFycmF5OiBBcnJheUxpa2U8VD4pOiBUIHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICBjb25zdCBsYXN0SW5kZXggPSBsZW5ndGggLSAxO1xuICByZXR1cm4gYXJyYXlbbGFzdEluZGV4XTtcbn1cblxuZnVuY3Rpb24gZmlyc3RVcHBlckNhc2Uoc3RyOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlyc3RBbHBoYWJldCA9IG5ldyBSZWdFeHAoLyggfF4pW2Etel0vLCBcImdcIik7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGZpcnN0QWxwaGFiZXQsIChMKSA9PiBMLnRvVXBwZXJDYXNlKCkpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdmZXJyYXJvMDMxNzIyXFxcXGRldlxcXFxiZXR0ZXItYmV0dGVyLW5ldHdvcmstcGFuZWxcXFxcdXRpbHNcXFxccGx1Z2luc1xcXFxtYWtlLW1hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nZmVycmFybzAzMTcyMi9kZXYvYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGNvbG9yTG9nIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgTWFuaWZlc3RQYXJzZXIgZnJvbSBcIi4uL21hbmlmZXN0LXBhcnNlclwiO1xuXG5jb25zdCB7IHJlc29sdmUgfSA9IHBhdGg7XG5cbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCJwdWJsaWNcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VNYW5pZmVzdChcbiAgbWFuaWZlc3Q6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjNcbik6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJtYWtlLW1hbmlmZXN0XCIsXG4gICAgYnVpbGRFbmQoKSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0RGlyKSkge1xuICAgICAgICBmcy5ta2RpclN5bmMob3V0RGlyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFuaWZlc3RQYXRoID0gcmVzb2x2ZShvdXREaXIsIFwibWFuaWZlc3QuanNvblwiKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhcbiAgICAgICAgbWFuaWZlc3RQYXRoLFxuICAgICAgICBNYW5pZmVzdFBhcnNlci5jb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdClcbiAgICAgICk7XG5cbiAgICAgIGNvbG9yTG9nKGBNYW5pZmVzdCBmaWxlIGNvcHkgY29tcGxldGU6ICR7bWFuaWZlc3RQYXRofWAsIFwic3VjY2Vzc1wiKTtcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXFxcXGxvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ2ZlcnJhcm8wMzE3MjIvZGV2L2JldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbC91dGlscy9sb2cudHNcIjt0eXBlIENvbG9yVHlwZSA9IFwic3VjY2Vzc1wiIHwgXCJpbmZvXCIgfCBcImVycm9yXCIgfCBcIndhcm5pbmdcIiB8IGtleW9mIHR5cGVvZiBDT0xPUlM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yTG9nKG1lc3NhZ2U6IHN0cmluZywgdHlwZT86IENvbG9yVHlwZSkge1xuICBsZXQgY29sb3I6IHN0cmluZyA9IHR5cGUgfHwgQ09MT1JTLkZnQmxhY2s7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnR3JlZW47XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiaW5mb1wiOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdCbHVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVycm9yXCI6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ1JlZDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ3YXJuaW5nXCI6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ1llbGxvdztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgY29uc29sZS5sb2coY29sb3IsIG1lc3NhZ2UpO1xufVxuXG5jb25zdCBDT0xPUlMgPSB7XG4gIFJlc2V0OiBcIlxceDFiWzBtXCIsXG4gIEJyaWdodDogXCJcXHgxYlsxbVwiLFxuICBEaW06IFwiXFx4MWJbMm1cIixcbiAgVW5kZXJzY29yZTogXCJcXHgxYls0bVwiLFxuICBCbGluazogXCJcXHgxYls1bVwiLFxuICBSZXZlcnNlOiBcIlxceDFiWzdtXCIsXG4gIEhpZGRlbjogXCJcXHgxYls4bVwiLFxuICBGZ0JsYWNrOiBcIlxceDFiWzMwbVwiLFxuICBGZ1JlZDogXCJcXHgxYlszMW1cIixcbiAgRmdHcmVlbjogXCJcXHgxYlszMm1cIixcbiAgRmdZZWxsb3c6IFwiXFx4MWJbMzNtXCIsXG4gIEZnQmx1ZTogXCJcXHgxYlszNG1cIixcbiAgRmdNYWdlbnRhOiBcIlxceDFiWzM1bVwiLFxuICBGZ0N5YW46IFwiXFx4MWJbMzZtXCIsXG4gIEZnV2hpdGU6IFwiXFx4MWJbMzdtXCIsXG4gIEJnQmxhY2s6IFwiXFx4MWJbNDBtXCIsXG4gIEJnUmVkOiBcIlxceDFiWzQxbVwiLFxuICBCZ0dyZWVuOiBcIlxceDFiWzQybVwiLFxuICBCZ1llbGxvdzogXCJcXHgxYls0M21cIixcbiAgQmdCbHVlOiBcIlxceDFiWzQ0bVwiLFxuICBCZ01hZ2VudGE6IFwiXFx4MWJbNDVtXCIsXG4gIEJnQ3lhbjogXCJcXHgxYls0Nm1cIixcbiAgQmdXaGl0ZTogXCJcXHgxYls0N21cIixcbn0gYXMgY29uc3Q7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdmZXJyYXJvMDMxNzIyXFxcXGRldlxcXFxiZXR0ZXItYmV0dGVyLW5ldHdvcmstcGFuZWxcXFxcdXRpbHNcXFxcbWFuaWZlc3QtcGFyc2VyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXFxcXG1hbmlmZXN0LXBhcnNlclxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ2ZlcnJhcm8wMzE3MjIvZGV2L2JldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbC91dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHNcIjt0eXBlIE1hbmlmZXN0ID0gY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMztcblxuY2xhc3MgTWFuaWZlc3RQYXJzZXIge1xuICAvKiogU0lOR0xFVE9OICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc3RhdGljIGNvbnZlcnRNYW5pZmVzdFRvU3RyaW5nKG1hbmlmZXN0OiBNYW5pZmVzdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0LCBudWxsLCAyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYW5pZmVzdFBhcnNlcjtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ2ZlcnJhcm8wMzE3MjJcXFxcZGV2XFxcXGJldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbFxcXFx1dGlsc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXFxcXHBsdWdpbnNcXFxcY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nZmVycmFybzAzMTcyMi9kZXYvYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiY3VzdG9tLWR5bmFtaWMtaW1wb3J0XCIsXG4gICAgcmVuZGVyRHluYW1pY0ltcG9ydCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IGBcbiAgICAgICAge1xuICAgICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnQgPSAocGF0aCkgPT4gaW1wb3J0KHBhdGgpO1xuICAgICAgICAgIGR5bmFtaWNJbXBvcnQoXG4gICAgICAgICAgYCxcbiAgICAgICAgcmlnaHQ6IFwiKX1cIixcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ2ZlcnJhcm8wMzE3MjJcXFxcZGV2XFxcXGJldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbFxcXFx1dGlsc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXHV0aWxzXFxcXHBsdWdpbnNcXFxcYWRkLWhtci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ2ZlcnJhcm8wMzE3MjIvZGV2L2JldHRlci1iZXR0ZXItbmV0d29yay1wYW5lbC91dGlscy9wbHVnaW5zL2FkZC1obXIudHNcIjtpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XG5cbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gXCJ0cnVlXCI7XG5cbmNvbnN0IERVTU1ZX0NPREUgPSBgZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXt9O2A7XG5cbmZ1bmN0aW9uIGdldEluamVjdGlvbkNvZGUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiByZWFkRmlsZVN5bmMoXG4gICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcInJlbG9hZFwiLCBcImluamVjdGlvbnNcIiwgZmlsZU5hbWUpLFxuICAgIHsgZW5jb2Rpbmc6IFwidXRmOFwiIH1cbiAgKTtcbn1cblxudHlwZSBDb25maWcgPSB7XG4gIGJhY2tncm91bmQ/OiBib29sZWFuO1xuICB2aWV3PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZEhtcihjb25maWc/OiBDb25maWcpOiBQbHVnaW5PcHRpb24ge1xuICBjb25zdCB7IGJhY2tncm91bmQgPSBmYWxzZSwgdmlldyA9IHRydWUgfSA9IGNvbmZpZyB8fCB7fTtcbiAgY29uc3QgaWRJbkJhY2tncm91bmRTY3JpcHQgPSBcInZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi1iYWNrZ3JvdW5kLXNjcmlwdFwiO1xuICBjb25zdCBpZEluVmlldyA9IFwidmlydHVhbDpyZWxvYWQtb24tdXBkYXRlLWluLXZpZXdcIjtcblxuICBjb25zdCBzY3JpcHRIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKFwic2NyaXB0LmpzXCIpIDogRFVNTVlfQ09ERTtcbiAgY29uc3Qgdmlld0htckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoXCJ2aWV3LmpzXCIpIDogRFVNTVlfQ09ERTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiYWRkLWhtclwiLFxuICAgIHJlc29sdmVJZChpZCkge1xuICAgICAgaWYgKGlkID09PSBpZEluQmFja2dyb3VuZFNjcmlwdCB8fCBpZCA9PT0gaWRJblZpZXcpIHtcbiAgICAgICAgcmV0dXJuIGdldFJlc29sdmVkSWQoaWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZChpZCkge1xuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5CYWNrZ3JvdW5kU2NyaXB0KSkge1xuICAgICAgICByZXR1cm4gYmFja2dyb3VuZCA/IHNjcmlwdEhtckNvZGUgOiBEVU1NWV9DT0RFO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWQgPT09IGdldFJlc29sdmVkSWQoaWRJblZpZXcpKSB7XG4gICAgICAgIHJldHVybiB2aWV3ID8gdmlld0htckNvZGUgOiBEVU1NWV9DT0RFO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFJlc29sdmVkSWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gXCJcXDBcIiArIGlkO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZmVycmFybzAzMTcyMlxcXFxkZXZcXFxcYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsXFxcXG1hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nZmVycmFybzAzMTcyMi9kZXYvYmV0dGVyLWJldHRlci1uZXR3b3JrLXBhbmVsL21hbmlmZXN0LnRzXCI7aW1wb3J0IHBhY2thZ2VKc29uIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xyXG5cclxuY29uc3QgbWFuaWZlc3Q6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjMgPSB7XHJcbiAgbWFuaWZlc3RfdmVyc2lvbjogMyxcclxuICBuYW1lOiBwYWNrYWdlSnNvbi5uYW1lLFxyXG4gIHZlcnNpb246IHBhY2thZ2VKc29uLnZlcnNpb24sXHJcbiAgZGVzY3JpcHRpb246IHBhY2thZ2VKc29uLmRlc2NyaXB0aW9uLFxyXG4gIC8vIG9wdGlvbnNfcGFnZTogXCJzcmMvcGFnZXMvb3B0aW9ucy9pbmRleC5odG1sXCIsXHJcbiAgLy8gYmFja2dyb3VuZDogeyBzZXJ2aWNlX3dvcmtlcjogXCJzcmMvcGFnZXMvYmFja2dyb3VuZC9pbmRleC5qc1wiIH0sXHJcbiAgYWN0aW9uOiB7XHJcbiAgICBkZWZhdWx0X3BvcHVwOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXHJcbiAgICBkZWZhdWx0X2ljb246IFwiaWNvbi0zNC5wbmdcIixcclxuICB9LFxyXG4gIC8vIGNocm9tZV91cmxfb3ZlcnJpZGVzOiB7XHJcbiAgLy8gICBuZXd0YWI6IFwic3JjL3BhZ2VzL25ld3RhYi9pbmRleC5odG1sXCIsXHJcbiAgLy8gfSxcclxuICBpY29uczoge1xyXG4gICAgXCIxMjhcIjogXCJpY29uLTEyOC5wbmdcIixcclxuICB9LFxyXG4gIC8vIGNvbnRlbnRfc2NyaXB0czogW1xyXG4gIC8vICAge1xyXG4gIC8vICAgICBtYXRjaGVzOiBbXCJodHRwOi8vKi8qXCIsIFwiaHR0cHM6Ly8qLypcIiwgXCI8YWxsX3VybHM+XCJdLFxyXG4gIC8vICAgICBqczogW1wic3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXguanNcIl0sXHJcbiAgLy8gICAgIGNzczogW1wiYXNzZXRzL2Nzcy9jb250ZW50U3R5bGUuY2h1bmsuY3NzXCJdLFxyXG4gIC8vICAgfSxcclxuICAvLyBdLFxyXG4gIGRldnRvb2xzX3BhZ2U6IFwic3JjL3BhZ2VzL2RldnRvb2xzL2luZGV4Lmh0bWxcIixcclxuICBwZXJtaXNzaW9uczogW1wic3RvcmFnZVwiXSxcclxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFtcclxuICAgIHtcclxuICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgXCJhc3NldHMvanMvKi5qc1wiLFxyXG4gICAgICAgIFwiYXNzZXRzL2Nzcy8qLmNzc1wiLFxyXG4gICAgICAgIFwiaWNvbi0xMjgucG5nXCIsXHJcbiAgICAgICAgXCJpY29uLTM0LnBuZ1wiLFxyXG4gICAgICBdLFxyXG4gICAgICBtYXRjaGVzOiBbXCIqOi8vKi8qXCJdLFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3Q7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVcsU0FBUyxvQkFBb0I7QUFDOVgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsV0FBQUEsVUFBUyxhQUFhOzs7QUNGb1gsWUFBWSxRQUFRO0FBQ3ZhLFlBQVksVUFBVTs7O0FDQ1AsU0FBUixTQUEwQixTQUFpQixNQUFrQjtBQUNsRSxNQUFJLFFBQWdCLFFBQVEsT0FBTztBQUVuQyxVQUFRLE1BQU07QUFBQSxJQUNaLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLEVBQ0o7QUFFQSxVQUFRLElBQUksT0FBTyxPQUFPO0FBQzVCO0FBRUEsSUFBTSxTQUFTO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUixLQUFLO0FBQUEsRUFDTCxZQUFZO0FBQUEsRUFDWixPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxPQUFP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TztBQUFBLElBQ0wsUUFBQUQ7QUFBQSxJQUNBLFdBQVdDO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxVQUFVSCxTQUFRLFVBQVUsWUFBWSxZQUFZO0FBQUEsUUFDcEQsT0FBT0EsU0FBUSxVQUFVLFNBQVMsWUFBWTtBQUFBLFFBQzlDLFNBQVNBLFNBQVEsVUFBVSxXQUFXLFVBQVU7QUFBQSxRQUNoRCxZQUFZQSxTQUFRLFVBQVUsY0FBYyxVQUFVO0FBQUEsUUFDdEQsY0FBY0EsU0FBUSxVQUFVLFdBQVcsWUFBWTtBQUFBLFFBQ3ZELE9BQU9BLFNBQVEsVUFBVSxTQUFTLFlBQVk7QUFBQSxRQUM5QyxRQUFRQSxTQUFRLFVBQVUsVUFBVSxZQUFZO0FBQUEsUUFDaEQsU0FBU0EsU0FBUSxVQUFVLFdBQVcsWUFBWTtBQUFBLE1BQ3BEO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0JHLFNBQ1osd0JBQ0E7QUFBQSxRQUNKLGdCQUFnQixDQUFDLGNBQWM7QUFDN0IsZ0JBQU0sRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJLE1BQU0sVUFBVSxJQUFJO0FBQ2pELGdCQUFNLGNBQWMsZUFBZSxJQUFJLE1BQU0sR0FBRyxDQUFDO0FBQ2pELGdCQUFNLE9BQU8sY0FBYyxlQUFlLEtBQUs7QUFDL0MsaUJBQU8sZ0JBQWdCO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyxlQUFrQixPQUF3QjtBQUNqRCxRQUFNLFNBQVMsTUFBTTtBQUNyQixRQUFNLFlBQVksU0FBUztBQUMzQixTQUFPLE1BQU07QUFDZjtBQUVBLFNBQVMsZUFBZSxLQUFhO0FBQ25DLFFBQU0sZ0JBQWdCLElBQUksT0FBTyxjQUFjLEdBQUc7QUFDbEQsU0FBTyxJQUFJLFlBQVksRUFBRSxRQUFRLGVBQWUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO0FBQ3hFOyIsCiAgIm5hbWVzIjogWyJyZXNvbHZlIiwgIm1hbmlmZXN0IiwgIm1hbmlmZXN0IiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJvdXREaXIiLCAiaXNEZXYiXQp9Cg==
