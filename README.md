### Procedures <a name="procedures"></a>

1. Run `yarn` or `npm i` (check your node version >= 16)
2. Run `yarn dev` or `npm run dev`
3. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
4. If you want to build in production, run `yarn build` or `npm run build`.

### Start the dev environment:

```
  yarn start

  pnpm startp
```

### View changes in the extension after a dev rebuild:

1. Open the extension in the devtools if not opened already
2. Right click in the extension panel then `Reload frame`

The changes should be applied

### Debug extension / see it's console:

1. Open the extension in the devtools
2. Right click in the extension panel then `Inspect`

It opens the devtools in devtools

## Thanks To

| [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

| [leothelocust/better-network-chrome-panel](https://github.com/leothelocust/better-network-chrome-panel)

| [josdejong/svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
