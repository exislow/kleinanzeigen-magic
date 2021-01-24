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
    this.$q.electron.ipcRenderer.on('m-login-error', (event, arg) => {
      this.isLogin = false;

      this.$router.push({ name: 'index', query: { logout: 'error' } });
    });
  }
}
</script>
