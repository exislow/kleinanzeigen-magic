export const ek = {
  computed: {
    ads: {
      get () {
        return this.$store.state.ek.ads
      },
      set (val) {
        this.$store.commit('ek/updateAds', val)
      }
    },
  }
}
