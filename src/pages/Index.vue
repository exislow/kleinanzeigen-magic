<template lang="pug">
  q-page
    .row.q-mt-xl.items-center.justify-center
      .col-6
        q-card.my-card
          q-card-section.bg-teal.text-white
            .text-h6 Kleinazeigen
            .text-subtitle2 Bitte einloggen.
          q-card-section
            q-form(@submit="login")
              q-input(v-model="email", label="E-Mail", dense)
              q-input(v-model="password", label="Passwort", :type="isPwd ? 'password' : 'text'" hint="Password with toggle", dense)
                template(v-slot:append)
                  q-icon(:name="isPwd ? 'visibility_off' : 'visibility'", class="cursor-pointer", @click="isPwd = !isPwd")
          q-card-section
            q-btn(label="Login", type="submit", color="primary", @click="login")
</template>

<script>
import { user } from 'src/mixins/user';
import settings from 'electron-settings';

export default {
  name: 'PageIndex',
  mixins: [ user ],
  data () {
    return {
      isPwd: true,
    }
  },
  mounted() {
    this.$q.electron.ipcRenderer.on('m-login', (event, arg) => {
      this.getProfile();
    });

    this.$q.electron.ipcRenderer.on('m-get-profile', (event, arg) => {
      this.$q.loading.hide()

      if (arg) {
        this.profile = arg;
        this.isLogin = true;
        this.$router.push({ name: 'overview' });
      }
    });

    if (this.$route.query.logout === 'normal') {
      this.$toasted.success('Du wurdest abgemeldet.');
    } else if (this.$route.query.logout === 'error') {
      this.$toasted.error('Es ist ein Fehler aufgetreten. Du wurdest abgemeldet.', { duration: 0 });
      this.$q.loading.hide()
    }
  },
  methods: {
    login: function() {
      this.showLoading();
      this.$q.electron.ipcRenderer.send( `r-login`, settings.getSync('credentials'));
    },
    getProfile() {
      this.$q.electron.ipcRenderer.send( `r-get-profile`);
    },
    showLoading: function() {
      this.$q.loading.show({
        message: 'Anmeldung läuft. Informationen werden abgefragt...'
      });
    }
  }
}
</script>
