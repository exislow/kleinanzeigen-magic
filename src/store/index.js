import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import ek from './ek';

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      ek
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./user', './ek'], () => {
      const newUser = require('./user').default;
      const newEk = require('./ek').default;
      Store.hotUpdate({
        modules: {
          user: newUser,
          ek: newEk
        }
      });
    });
  }

  return Store;
}
