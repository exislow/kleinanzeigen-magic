export function updateCookies (state, ekCookieStr) {
  state.cookies = ekCookieStr;
  console.log('update done', ekCookieStr)
}

export function updateAds (state, ads) {
  state.ads = ads;
}
