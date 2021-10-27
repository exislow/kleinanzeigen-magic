import settings from 'electron-settings';

export const user = {
  computed: {
    isLogin: {
      get () {
        return this.$store.state.user.isLogin;
      },
      set (val) {
        this.$store.commit('user/updateIsLogin', val);
        settings.setSync('isLogin', val);
      }
    },
    email: {
      get () {
        return this.$store.state.user.email;
      },
      set (val) {
        this.$store.commit('user/updateEmail', val);
        settings.setSync('credentials.email', val);
      }
    },
    password: {
      get () {
        return this.$store.state.user.password;
      },
      set (val) {
        this.$store.commit('user/updatePassword', val);
        settings.setSync('credentials.password', val);
      }
    },
    token: {
      get () {
        return this.$store.state.user.token;
      },
      set (val) {
        this.$store.commit('user/updateToken', val);
        settings.setSync('credentials.token', val);
      }
    },
    profile: {
      get () {
        return this.$store.state.user.profile;
      },
      set (val) {
        this.$store.commit('user/updateProfile', val);
      }
    }
  }
}
