import { app, BrowserWindow, nativeTheme } from 'electron';
import contextMenu from 'electron-context-menu';
import unhandled from 'electron-unhandled';
import { enforceMacOSAppLocation } from 'electron-util';

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

unhandled();
/*
setContentSecurityPolicy(`
  default-src 'self';
  script-src 'self';
  img-src 'self' data:;
  style-src 'self';
  font-src 'self';
  connect-src 'self' https://api.ebay-kleinanzeigen.de;
  base-uri '/';
  form-action 'self';
  frame-ancestors 'none';
`);
 */

contextMenu({
  menu: (actions, props, browserWindow, dictionarySuggestions) => [
    ...dictionarySuggestions,
    actions.separator(),
    actions.copyLink({
      transform: content => `modified_link_${content}`
    }),
    actions.separator(),
    {
      label: 'Magic like an Unicorn!',
      enabled: false,
    },
    actions.separator(),
    actions.copy({
      transform: content => `modified_copy_${content}`
    }),
    {
      label: 'Invisible',
      visible: false
    },
    actions.paste({
      transform: content => `modified_paste_${content}`
    })
  ]
});

let mainWindow;

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      webSecurity: true,
      webviewTag: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL);

  enforceMacOSAppLocation();

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

import './bootstrap.js'
