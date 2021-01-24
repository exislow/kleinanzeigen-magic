import settings from 'electron-settings';

export const user = {
  computed: {
    isLogin: {
      get () {
        return this.$store.state.user.isLogin;
      },
      set (val) {
        this.$store.commit('user/updateIsLogin', val)
      }
    },
    email: {
      get () {
        return this.$store.state.user.email;
      },
      set (val) {
        this.$store.commit('user/updateEmail', val)
      }
    },
    password: {
      get () {
        return this.$store.state.user.password;
      },
      set (val) {
        this.$store.commit('user/updatePassword', val)
      }
    },
    profile: {
      get () {
        return this.$store.state.user.profile;
      },
      set (val) {
        this.$store.commit('user/updateProfile', val)
      }
    }
  }
}
