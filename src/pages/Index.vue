<template lang="pug">
  q-page
    .row.q-mt-xl.items-center.justify-center
      .col-6
        q-card.my-card
          q-card-section.bg-teal.text-white
            .text-h6 Kleinanzeigen
            .text-subtitle2 Bitte einloggen.
          q-card-section
            q-form(@submit="login")
              q-input(v-model="email", label="E-Mail", dense,
                :rules="[value => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || 'Bitte gib deine E-Mail Adresse an.']",
                lazy-rules)
              q-input(v-model="password", label="Passwort", :type="isPwd ? 'password' : 'text'" hint="Password with toggle",
                dense, :rules="[ val => !!val || 'Darf nicht leer sein.']", lazy-rules)
                template(v-slot:append)
                  q-icon(:name="isPwd ? 'visibility_off' : 'visibility'", class="cursor-pointer", @click="isPwd = !isPwd")
              q-btn.q-mt-lg(label="Login", type="submit", color="primary")
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
      this.isLogin = arg;

      if (this.isLogin) {
        this.getProfile();
      } else {
        this.$q.loading.hide()
      }
    });

    this.$q.electron.ipcRenderer.on('m-get-profile', (event, arg) => {
      this.$q.loading.hide()

      if (arg) {
        this.profile = arg;
        this.isLogin = true;
        this.$router.push({ name: 'overview' });
      }
    });
  },
  methods: {
    login: function() {
      this.showLoading();
      this.$q.electron.ipcRenderer.send( `r-login`, settings.getSync('credentials'));
    },
    getProfile: function() {
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
