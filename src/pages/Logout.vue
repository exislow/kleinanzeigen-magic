<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
import { user } from 'src/mixins/user';

export default {
  name: 'Logout',
  mixins: [ user ],
  created() {
    this.isLogin = false;
    this.email = null;
    this.password = null;

    this.$router.push({ name: 'index', query: { logout: 'normal' } });
  },
}
</script>
