import settings from 'electron-settings';

export function updateIsLogin (state, val) {
  state.isLogin = val;
}

export function updateEmail (state, val) {
  state.email = val;
  settings.setSync('credentials.email', val);
}

export function updatePassword (state, val) {
  state.password = val;
  settings.setSync('credentials.password', val);
}

export function updateProfile (state, val) {
  state.profile = val;
}

export function updateToken (state, val) {
  state.token = val;
}
