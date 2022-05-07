import {AttributeError, AuthorizationError, AxiosError, RemoteNotFound, RemoteSystemError} from './exceptions';
import {createWriteStream, mkdtemp, readFile, unlink} from 'fs';
import axios from 'axios';
import _ from 'lodash';
import {join} from 'path';
import {Kleinanzeigen} from './kleinanzeigen';
import {tmpdir} from 'os';
import builder from 'xmlbuilder';
import sanitize from 'sanitize-filename';

export const generateExceptionStr = (exc) => {
  return `${exc.name}: ${exc.message}`;
};

export const exceptionHandler = (exc, ipcEvent) => {
  if (exc.constructor === AuthorizationError) {
    ipcEvent.reply('m-error-login', generateExceptionStr(exc));
  } else if (exc.constructor === RemoteSystemError) {
    ipcEvent.reply('m-error-general', generateExceptionStr(exc));
  } else if (exc.constructor === RemoteNotFound) {
    ipcEvent.reply('m-error-general', generateExceptionStr(exc));
  } else if (exc.constructor === AttributeError) {
    ipcEvent.reply('m-error-general', generateExceptionStr(exc));
  } else if (exc.constructor === AxiosError) {
    ipcEvent.reply('m-error-axios', exc);
  } else {
    ipcEvent.reply('m-error-general', exc.message);
  }
};

export const readFileAsync = async function (path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};
export const createTempDir = async function (prefix = 'ebk-') {
  return new Promise((resolve, reject) => {
    mkdtemp(join(tmpdir(), prefix), (err, folder) => {
      if (err) {
        return reject(err);
      }

      return resolve(folder);
    });
  });
};

export const reUploadImages = async function (adPictures) {
  const adImageUrls = [];
  const adImagePath = [];
  let tmpDirPath = null;

  // Create tmp dir
  try {
    tmpDirPath = await createTempDir();
  } catch (e) {
    throw e;
  }

  // Download images
  for (const arrayItem of adPictures) {
    const imgUrl = _.find(arrayItem.link, function (o) {
      return o.rel === 'XXL';
    }).href;
    const imgUrlSplit = imgUrl.split('/');
    const imgNameNew = sanitize(`${imgUrlSplit[imgUrlSplit.length - 2]}_${imgUrlSplit[imgUrlSplit.length - 1]}`);
    const pathDest = join(tmpDirPath, imgNameNew);

    try {
      const data = await downloadImage(imgUrl, pathDest);

      adImagePath.push(pathDest);
    } catch (e) {
      throw e;
    }
  }

  // Upload images
  const k = new Kleinanzeigen();

  for (const aip of adImagePath) {
    try {
      const imageLinks = await k.uploadPicture(aip);

      adImageUrls.push(imageLinks);

      unlink(aip, function (err) {
        if (err) return console.log(err);
      });
    } catch (e) {
      throw e;
    }
  }

  return adImageUrls;
};

export const downloadImage = async function (url, path) {
  const writer = createWriteStream(path);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const xmlBuilderPictureLinks = function (adImageUrls) {
  const picPicture = [];

  for (const aiu of adImageUrls) {
    const picLink = [];

    for (const linkObj of aiu.link) {
      picLink.push({
        '@href': linkObj.href,
        '@rel': linkObj.rel
      });
    }

    picPicture.push({'pic:link': picLink});
  }

  const picPictures = {'pic:picture': picPicture};
  const root = {'pic:pictures': picPictures};
  const xmlFeedPictures = builder.create(root, {encoding: 'utf-8', headless: true});
  return xmlFeedPictures.end({pretty: false});
};
