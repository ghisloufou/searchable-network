### Procedures <a name="procedures"></a>

3. Run `yarn` or `npm i` (check your node version >= 16)
4. Run `yarn dev` or `npm run dev`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `yarn build` or `npm run build`.

### Dev Procedures

I start these 3 commands in separate terminals for a good dev env:
  yarn buildw
  yarn typew
  yarn dev

then open the chrome:extensions to restart the extension each time I save
then open a new tab to open devtools in undocked mode
then open the panel
then press ctrl+shif+i to open devtools in devtools

## Thanks To

| [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
| [leothelocust/better-network-chrome-panel](https://github.com/leothelocust/better-network-chrome-panel)
