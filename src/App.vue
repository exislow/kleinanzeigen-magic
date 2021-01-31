<template lang="pug">
  q-layout#q-app(view="lHh Lpr lFf")
    main-layout
    q-page-container
      router-view
</template>

<script>
import { Dark } from 'quasar';
import MainLayout from 'src/layouts/MainLayout';
import { user } from 'src/mixins/user';

// set status
Dark.set(true) // or false or "auto"

export default {
  name: 'App',
  components: {
    MainLayout
  },
  mixins: [ user ],
  mounted() {
    this.$q.electron.ipcRenderer.on('m-error-login', (event, arg) => {
      this.errorLogin();
    });
    this.$q.electron.ipcRenderer.on('m-error-axios', (event, arg) => {
      this.errorGeneral(arg);
    });
    this.$q.electron.ipcRenderer.on('m-error-general', (event, arg) => {
      this.errorGeneral(arg);
    });
  },

  methods: {
    errorLogin: function () {
      this.isLogin = false;
      this.profile = null;

      if (this.$route.name !== 'index') {
        this.$router.push({ name: 'index' });
      }
      this.$toasted.error('Falsche E-Mail Adresse und/oder Passwort.', { duration: 0 });
    },

    errorGeneral: function (msg) {
      this.$toasted.error(msg);
    }
  }
}
</script>
