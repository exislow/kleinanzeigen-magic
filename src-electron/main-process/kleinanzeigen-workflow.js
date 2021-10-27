import { Kleinanzeigen } from './kleinanzeigen';
import settings from 'electron-settings';


export const login = async () => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.doLogin();

    return result;
  } catch (e) {
    throw e;
  }
};

export const getAds = async () => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.getAds();

    return result;
  } catch (e) {
    throw e;
  }
};


export const getViewCount = async (adId) => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.getCountViews(adId);

    return result;
  } catch (e) {
    throw e;
  }
};


export const getWatchlistCount = async (adId) => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.getCountWatchlist(adId);

    return result;
  } catch (e) {
    throw e;
  }
};

export const adPause = async (id) => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.deactivateAd(id);

    return result;
  } catch (e) {
    throw e;
  }
};

export const adResume = async (id) => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.activateAd(id);

    return result;
  } catch (e) {
    throw e;
  }
};

export const adDelete = async (id) => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.deleteAd(id);

    return result;
  } catch (e) {
    throw e;
  }
};

export const adTopUp = async (id, price) => {
  let adXmlPost = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?><ad:ad xmlns:types="http://www.ebayclassifiedsgroup.com/schema/types/v1" xmlns:cat="http://www.ebayclassifiedsgroup.com/schema/category/v1" xmlns:ad="http://www.ebayclassifiedsgroup.com/schema/ad/v1" xmlns:loc="http://www.ebayclassifiedsgroup.com/schema/location/v1" xmlns:attr="http://www.ebayclassifiedsgroup.com/schema/attribute/v1" xmlns:pic="http://www.ebayclassifiedsgroup.com/schema/picture/v1" xmlns:user="http://www.ebayclassifiedsgroup.com/schema/user/v1" xmlns:rate="http://www.ebayclassifiedsgroup.com/schema/rate/v1" xmlns:reply="http://www.ebayclassifiedsgroup.com/schema/reply/v1" xmlns:feed="http://www.ebayclassifiedsgroup.com/schema/feed/v1" locale="en_US" id="0"><ad:email>${settings.getSync('credentials.email')}</ad:email>`;
  const k = new Kleinanzeigen();
  const regexAmount = /amount>(.*)<\/types:amount>/;
  const substAmounnt = `amount>${price}</types:amount>`;
  const regexTitle = /<ad:title>.*<\/ad:title>/;
  const regexDesc = /<ad:description>.*<\/ad:description>/;
  const regexCat = /<cat:category id="\d+"/;
  const regexLoc = /<loc:locations><loc:location id="\d+"/;
  const regexPriceType = /<types:price-type>.*<\/types:price-type>/;
  const regexPriceAmount = /<types:amount>.*<\/types:amount>/;
  const regexAdType = /<ad:ad-type>.*<\/ad:ad-type>/;
  const regexPosterType = /<ad:poster-type>.*<\/ad:poster-type>/;
  const regexContactName = /<ad:contact-name>.*<\/ad:contact-name>/;
  const regexAttr = /<attr:attributes>.*<\/attr:attributes>/;
  const regexPics = /<pic:pictures>.*<\/pic:pictures>/;

  try {
    const adXml = await k.getAdXml(id);
    const adXmlPrice = adXml.replace(regexAmount, substAmounnt);
    adXmlPost += adXmlPrice.match(regexTitle);
    adXmlPost += adXmlPrice.match(regexDesc);
    adXmlPost += `${adXmlPrice.match(regexCat)} />`;
    adXmlPost += `${adXmlPrice.match(regexLoc)} /></loc:locations><ad:ad-address/>`;
    adXmlPost += `<ad:price>${adXmlPrice.match(regexPriceType)}${adXmlPrice.match(regexPriceAmount)}</ad:price>`;
    adXmlPost += adXmlPrice.match(regexAdType);
    adXmlPost += adXmlPrice.match(regexPosterType);
    adXmlPost += adXmlPrice.match(regexContactName);
    adXmlPost += adXmlPrice.match(regexAttr);
    adXmlPost += adXmlPrice.match(regexPics);
    adXmlPost += '</ad:ad>';

    const resultCreate = await k.createAd(adXmlPost);
    let resultDelete = null;

    if (resultCreate === true) {
      resultDelete = await k.deleteAd(id);
      // TODO: Check if creation was successfull otherwise delete newly created item.
    }

    return resultCreate, resultDelete;
  } catch (e) {
    throw e;
  }
};

export const getProfile = async () => {
  const k = new Kleinanzeigen();

  try {
    const result = await k.getProfile();

    return result;
  } catch (e) {
    throw e;
  }
};
