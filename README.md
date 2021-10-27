# Kleinanzeigen Magic (kleinanzeigen-magic)
Die Kleinanzeigen Magic App hilft bestimmte Vorgänge bei deinen [eBay Kleinanzeigen](https://www.ebay-kleinanzeigen.de/) zu beschleunigen. So kannst beispielsweise deine Anzeigen kostenfrei wieder ganz oben in der Ergebnisliste der Suche platzieren.

[Hier](https://github.com/exislow/kleinanzeigen-magic/releases) kannst du dir die Kleinanzeigen Magic App downloaden.


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


## Shouts

* I got the inspiration from the Python based [ebk-client](https://github.com/tejado/ebk-client). I have ported it to NodeJS, extended it and also built a GUI on top.
