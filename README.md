# Kleinanzeigen Magic
The Kleinanzeigen Magic App helps you to speed up certain workflows at [eBay Kleinanzeigen](https://www.ebay-kleinanzeigen.de/) for free! For instance, it is possible to push your ads to the very top of the search results with one click.

You can download a compiled release of this app [here](https://github.com/exislow/kleinanzeigen-magic/releases).


## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev --debug -m electron
```

Also check the files in folder `./doc`.

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build -m electron
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## FAQ

### How to decompile the eBay Kleinanzeigen app?

1. Copy the Google PlayStore eBay Kleinanzeigen app link: https://play.google.com/store/apps/details?id=com.ebay.kleinanzeigen
2. Use any APK downloader to download the app's APK, e.g. https://apkpure.com/de/
3. Rename the downloaded `*.xapk` file to `*.zip` and extract it.
4. Decompile the extracted `com.ebay.kleinanzeigen.apk` using any Android decompiler, e.g. http://www.javadecompilers.com/
5. Start reverse engineering.


## Credits

* I got the inspiration from the Python based [ebk-client](https://github.com/tejado/ebk-client). So I have ported it to NodeJS, extended it and also built a GUI on top.
