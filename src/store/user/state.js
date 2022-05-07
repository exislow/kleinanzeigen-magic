import settings from 'electron-settings';

export default function () {
  return {
    isLogin: false,
    email: settings.getSync('credentials.email') || null,
    password: settings.getSync('credentials.password') || null,
    profile: null,
    token: null
  }
}
