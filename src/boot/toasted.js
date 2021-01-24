import Toasted from 'vue-toasted';

// more info on params: https://quasar.dev/quasar-cli/boot-files
export default  ({ Vue, router }) => {
  Vue.use(Toasted, {
    router,
    iconPack : 'material',
    position: 'bottom-right',
    fullWidth: false,
    fitToScreen: false,
    duration: '5000',
    keepOnHover: true,
    icon: 'check',
    action: {
      text : 'Ok',
      onClick : (e, toastObject) => {
        toastObject.goAway(0);
      }
    },
    type: 'default'
  });
}
