import axios from 'axios';
import {AttributeError, AuthorizationError, AxiosError, RemoteNotFound, RemoteSystemError} from './exceptions';
import settings from 'electron-settings';
import crypto from 'crypto';
import _ from 'lodash';
import FormData from 'form-data';
import {readFileAsync} from './utilities';

export class Kleinanzeigen {
  APK_APP_VERSION = '13.4.2';
  USER_AGENT = 'Dalvik/2.2.0';
  BASE_URL = 'https://api.kleinanzeigen.de/api';
  EBAYK_APP = '13a6dde3-935d-4cd8-9992-db8a8c4b6c0f1456515662229';
  BASIC_AUTH_USER = 'android';
  BASIC_AUTH_PASSWORD = 'TaR60pEttY';

  constructor() {
    try {
      this._email = settings.getSync('credentials.email');
      this._password = settings.getSync('credentials.password');
      this._token = settings.getSync('credentials.token');
    } catch (e) {
      throw new AttributeError('Credentials not set. Please provide e-mail address and password.');
    }

    this._passwordHashed = crypto.createHash('sha1').update(this._password, 'utf8').digest('base64');

    const axiosConfig = {
      baseURL: this.BASE_URL,
      headers: (this._token) ? this._generateHeaderToken() : this._generateHeaderPassword(),
      auth: {
        username: this.BASIC_AUTH_USER,
        password: this.BASIC_AUTH_PASSWORD
      },
      validateStatus: function (status) {
        return true;
      }
    };
    this._axios = axios.create(axiosConfig);
  }

  _generateHeaderBase() {
    return {
      'X-ECG-USER-AGENT': `ebayk-android-app-${this.APK_APP_VERSION}`,
      'X-ECG-USER-VERSION': this.APK_APP_VERSION,
      'X-ECG-Authorization-User': null,
      'X-EBAYK-APP': this.EBAYK_APP,
      'Content-Type': 'application/xml',
      'User-Agent': this.USER_AGENT
    };
  };

  _generateHeaderPassword() {
    const header = this._generateHeaderBase();
    header['X-ECG-Authorization-User'] = `email="${this._email}",password="${this._passwordHashed}"`;

    return header;
  };

  _generateHeaderToken() {
    const header = this._generateHeaderBase();
    header['X-ECG-Authorization-User'] = `email="${this._email}",token="${this._token}"`;

    return header;
  };

  _validateHttpResponse(response) {
    if (response.status < 400) {
      return true;
    } else {
      if (response.status === 401) {
        throw new AuthorizationError(`Wrong user credentials (HTTP ${response.status}).`);
      } else if (response.status === 404) {
        throw new RemoteNotFound(`API not found (HTTP ${response.status}).`);
      } else if (response.status >= 500) {
        throw new RemoteSystemError(`Server side error (HTTP ${response.status}).`);
      }
    }
  }

  async _httpGet(urlSuffix) {
    let response = null;

    try {
      response = await this._axios.get(urlSuffix);
    } catch (e) {
      throw new AxiosError(e);
    }

    this._validateHttpResponse(response);

    return response;
  }

  async _httpGetData(urlSuffix) {
    try {
      const response = await this._httpGet(urlSuffix);
      const data = response.data;

      return data;
    } catch (e) {
      throw e;
    }
  }

  async _httpGetHeaders(urlSuffix) {
    try {
      const response = await this._httpGet(urlSuffix);
      const data = response.headers;

      return data;
    } catch (e) {
      throw e;
    }
  }

  _getJsonContent(data) {
    let content = null;

    _.forOwn(data, function (value, key) {
      if (key.startsWith('{http')) {
        content = data[key].value;
      }
    });

    return content;
  }

  async _httpGetJsonContent(urlSuffix) {
    let data = null;

    try {
      data = await this._httpGetData(urlSuffix);
    } catch (e) {
      throw e;
    }

    const content = this._getJsonContent(data);

    return content;
  }

  async _httpGetLoginToken(urlSuffix) {
    let data = null;

    try {
      data = await this._httpGetHeaders(urlSuffix);
    } catch (e) {
      throw e;
    }

    const content = data['x-ebayk-token'];

    return content;
  }

  async _httpPut(urlSuffix, data = '') {
    let response = null;
    try {
      response = await this._axios.put(urlSuffix, data);
    } catch (e) {
      console.log(e);
      throw AxiosError(e);
    }

    this._validateHttpResponse(response);

    return response;
  }

  async _httpDelete(urlSuffix, data = '') {
    let response = null;

    try {
      response = await this._axios.delete(urlSuffix);
    } catch (e) {
      console.log(e);
      throw AxiosError(e);
    }

    this._validateHttpResponse(response);

    return response;
  }

  async _httpPost(urlSuffix, data = '') {
    let response = null;

    try {
      response = await this._axios.post(urlSuffix, data);
    } catch (e) {
      console.log(e);
      throw AxiosError(e);
    }

    this._validateHttpResponse(response);

    return response;
  }

  async _httpPostFile(urlSuffix, path) {
    const data = new FormData();
    let response = null;
    let file = null;
    let config = null;

    try {
      file = await readFileAsync(path);
      data.append('file', file, 'image.jpg');
      config = {
        headers: data.getHeaders()
      };
    } catch (e) {
      throw e;
    }

    try {
      response = await this._axios.post(urlSuffix, data, config);
    } catch (e) {
      console.log(e);
      throw AxiosError(e);
    }

    this._validateHttpResponse(response);

    return response.data;
  }

  async _httpPostJsonFile(urlSuffix, path) {
    let data = null;

    try {
      data = await this._httpPostFile(urlSuffix, path);
    } catch (e) {
      throw e;
    }

    const content = this._getJsonContent(data);

    return content;
  }

  async _changeAdStatus(id, status) {
    if (['active', 'paused'].indexOf(status) < 0) {
      throw AttributeError(`Unknown requested status: ${status}`);
    }

    const urlSuffix = `/users/${this._email}/ads/${status}/${id}.json`;

    try {
      const response = await this._httpPut(urlSuffix);
      const result = response.status === 204;

      return result;
    } catch (e) {
      throw e;
    }
  }

  async getAds() {
    const urlSuffix = `/users/${this._email}/ads.json?size=9999`;

    try {
      const content = await this._httpGetJsonContent(urlSuffix);
      const ad = content.ad ?? [];

      return ad;
    } catch (e) {
      throw e;
    }
  }


  async doLogin() {
    const urlSuffix = `/users/login`;

    try {
      const content = await this._httpGetLoginToken(urlSuffix);
      this._token = content;
      settings.setSync('credentials.token', content);

      return true;
    } catch (e) {
      throw e;
    }
  }

  async getAd(id) {
    const urlSuffix = `/ads/${id}.json`;

    try {
      const content = await this._httpGetJsonContent(urlSuffix);

      return content;
    } catch (e) {
      throw e;
    }
  }

  async getCountViews(id) {
    const urlSuffix = `/v2/counters/ads/vip/${id}.json`;

    try {
      const content = await this._httpGetData(urlSuffix);

      return content.value;
    } catch (e) {
      throw e;
    }
  }

  async getCountWatchlist(id) {
    const urlSuffix = `/v2/counters/ads/watchlist?adIds=${id}`;
    let content = null;

    try {
      content = await this._httpGetData(urlSuffix);
    } catch (e) {
      throw e;
    }

    return content.counters[0].value;
  }

  async getProfile() {
    const urlSuffix = `/users/${this._email}/profile.json`;

    try {
      const content = await this._httpGetData(urlSuffix);

      return content;
    } catch (e) {
      throw e;
    }
  }

  async getAdXml(id) {
    const urlSuffix = `/ads/${id}`;

    try {
      const data = await this._httpGetData(urlSuffix);

      return data;
    } catch (e) {
      throw e;
    }
  }

  async activateAd(id) {
    try {
      const result = await this._changeAdStatus(id, 'active');

      return result;
    } catch (e) {
      throw e;
    }
  }

  async deactivateAd(id) {
    try {
      const result = await this._changeAdStatus(id, 'paused');

      return result;
    } catch (e) {
      throw e;
    }
  }

  async deleteAd(id) {
    const urlSuffix = `/users/${this._email}/ads/${id}`;

    try {
      const response = await this._httpDelete(urlSuffix);

      return response.status === 204;
    } catch (e) {
      throw e;
    }
  }

  async createAd(xml) {
    const urlSuffix = `/users/${this._email}/ads.json`;

    try {
      const response = await this._httpPost(urlSuffix, xml);

      return response.status === 201;
    } catch (e) {
      throw e;
    }
  }

  async uploadPicture(path) {
    try {
      const result = await this._httpPostJsonFile('/pictures.json', path);

      return result;
    } catch (e) {
      throw e;
    }
  }
}



