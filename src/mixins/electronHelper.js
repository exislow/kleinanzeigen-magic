
export const electronHelper = {
  methods: {
    openExternal: function(url) {
      this.$q.electron.shell.openExternal(url);
    }
  }
}
