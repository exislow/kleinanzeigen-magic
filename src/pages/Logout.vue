<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
import { user } from 'src/mixins/user';
import { ek } from 'src/mixins/ek';

export default {
  name: 'Logout',
  mixins: [ user, ek ],
  created() {
    this.$toasted.success('Du wurdest abgemeldet.');
    this.isLogin = false;
    this.email = null;
    this.password = null;
    this.ads = null;

    this.$router.push({ name: 'index' });
  },
}
</script>
