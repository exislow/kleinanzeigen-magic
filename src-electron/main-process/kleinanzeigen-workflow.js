import {Kleinanzeigen} from './kleinanzeigen';
import settings from 'electron-settings';
import {reUploadImages, xmlBuilderPictureLinks} from './utilities';
import he from 'he';


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

export const adTopUp = async (id, price, title) => {
  let adXmlPost = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ad:ad id="${id}" locale="de_DE" version="1.16" xmlns:ad="http://www.ebayclassifiedsgroup.com/schema/ad/v1" xmlns:attr="http://www.ebayclassifiedsgroup.com/schema/attribute/v1" xmlns:cat="http://www.ebayclassifiedsgroup.com/schema/category/v1" xmlns:counter="http://www.ebayclassifiedsgroup.com/schema/counter/v1" xmlns:dfp="http://www.ebayclassifiedsgroup.com/schema/dfp/v1" xmlns:displayoption="http://www.ebayclassifiedsgroup.com/schema/displayoption/v1" xmlns:document="http://www.ebayclassifiedsgroup.com/schema/document/v1" xmlns:feat="http://www.ebayclassifiedsgroup.com/schema/feature/v1" xmlns:flag="http://www.ebayclassifiedsgroup.com/schema/flag/v1" xmlns:loc="http://www.ebayclassifiedsgroup.com/schema/location/v1" xmlns:media="http://www.ebayclassifiedsgroup.com/schema/media/v1" xmlns:ns6="http://www.ebayclassifiedsgroup.com/schema/shipping/v1" xmlns:partnership="http://www.ebayclassifiedsgroup.com/schema/partnership/v1" xmlns:payment="http://www.ebayclassifiedsgroup.com/schema/payment/v1" xmlns:pic="http://www.ebayclassifiedsgroup.com/schema/picture/v1" xmlns:reply="http://www.ebayclassifiedsgroup.com/schema/reply/v1" xmlns:stat="http://www.ebayclassifiedsgroup.com/schema/stat/v1" xmlns:sug="http://www.ebayclassifiedsgroup.com/schema/suggestion/v1" xmlns:tracking="http://www.ebayclassifiedsgroup.com/schema/tracking/v1" xmlns:types="http://www.ebayclassifiedsgroup.com/schema/types/v1" ><ad:email>${settings.getSync('credentials.email')}</ad:email>`;
  const k = new Kleinanzeigen();
  const regexAmount = /amount>(.*)<\/types:amount>/;
  const substAmount = `amount>${price}</types:amount>`;
  const regexSubstTitle = /title>(.*)<\/ad:title>/;
  const substTitle = `title><![CDATA[${title}]]></ad:title>`;
  const regexTitle = /<ad:title>.*<\/ad:title>/;
  const regexDesc = /<ad:description>(.*)<\/ad:description>/;
  const regexCat = /<cat:category id="\d+"/;
  const regexLoc = /<loc:locations><loc:location id="\d+"/;
  const regexPriceType = /<types:price-type>.*<\/types:price-type>/;
  const regexPriceAmount = /<types:amount>.*<\/types:amount>/;
  const regexAdType = /<ad:ad-type>.*<\/ad:ad-type>/;
  const regexPosterType = /<ad:poster-type>.*<\/ad:poster-type>/;
  const regexContactName = /<ad:contact-name>.*<\/ad:contact-name>/;
  const regexAttr = /<attr:attributes>.*<\/attr:attributes>/;
  const regexShipping = /<ns6:shipping-options>.*<\/ns6:shipping-options>/;
  let ad = null;
  let xmlPictures = '';

  try {
    ad = await k.getAd(id);
  } catch (e) {
    throw e;
  }

  if ('pictures' in ad) {
    const adImageUrls = await reUploadImages(ad.pictures.picture);
    xmlPictures = xmlBuilderPictureLinks(adImageUrls);
  }

  try {
    const adXml = await k.getAdXml(id);
    const adXmlTitle = adXml.replace(regexSubstTitle, substTitle);
    const adXmlPrice = adXmlTitle.replace(regexAmount, substAmount);
    let adTitle = adXmlPrice.match(regexTitle);
    adXmlPost += adTitle;
    adXmlPost += adXmlPrice.match(regexTitle);
    // Weird library behavior: Until proper decode you need to decode the string twice.
    let adXmlDescTmp = adXmlPrice.match(regexDesc)[1];
    let adXmlDescTmpDec = he.decode(adXmlDescTmp);
    let adXmlDescTmpDecDec = he.decode(adXmlDescTmpDec);
    adXmlPost += `<ad:description><![CDATA[${adXmlDescTmpDecDec}]]></ad:description>`;
    adXmlPost += `${adXmlPrice.match(regexCat)} />`;
    adXmlPost += `${adXmlPrice.match(regexLoc)} /></loc:locations><ad:ad-address/>`;
    adXmlPost += `<ad:price>${adXmlPrice.match(regexPriceType)}${adXmlPrice.match(regexPriceAmount)}</ad:price>`;
    adXmlPost += adXmlPrice.match(regexAdType);
    adXmlPost += adXmlPrice.match(regexPosterType);
    adXmlPost += adXmlPrice.match(regexContactName);
    adXmlPost += adXmlPrice.match(regexShipping);
    adXmlPost += adXmlPrice.match(regexAttr);
    adXmlPost += xmlPictures;
    adXmlPost += '</ad:ad>';

    const resultCreate = await k.createAd(adXmlPost);
    let resultDelete = false;

    if (resultCreate === true) {
      resultDelete = await k.deleteAd(id);
      // TODO: Check if deletion was successful otherwise delete newly created item.
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

