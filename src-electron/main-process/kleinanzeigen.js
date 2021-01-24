import axios from 'axios';
import {RemoteSystemError, AuthorizationError, RemoteNotFound, AttributeError, AxiosError} from './exceptions';
import settings from 'electron-settings';
import crypto from 'crypto';
import _ from 'lodash';

export class Kleinanzeigen {
  APK_APP_VERSION = '12.2.0';
  USER_AGENT = 'Dalvik/2.2.0';
  BASE_URL = 'https://api.ebay-kleinanzeigen.de/api';
  EBAYK_APP = '13a6dde3-935d-4cd8-9992-db8a8c4b6c0f1456515662229';
  BASIC_AUTH_USER = 'android';
  BASIC_AUTH_PASSWORD =  'TaR60pEttY';

  constructor() {
    try {
      this._email = settings.getSync('credentials.email');
      this._password = settings.getSync('credentials.password');
    } catch (e) {
      throw new AttributeError('Credentials not set. Please provide e-mail address and password.')
    }

    this._passwordHashed = crypto.createHash('sha1').update(this._password, 'utf8').digest('base64');

    const axsioConfig = {
      baseURL: this.BASE_URL,
      headers: this._generateHeader(),
      auth: {
        username: this.BASIC_AUTH_USER,
        password: this.BASIC_AUTH_PASSWORD
      }
    };
    this._axios = axios.create(axsioConfig);
  }

  _generateHeader() {
    return {
      'X-ECG-USER-AGENT': `ebayk-android-app-${this.APK_APP_VERSION}`,
      'X-ECG-USER-VERSION': this.APK_APP_VERSION,
      'X-ECG-Authorization-User': `email="${this._email}",password="${this._passwordHashed}"`,
      'X-EBAYK-APP': this.EBAYK_APP,
      //'Authorization': `Basic ${this.BASIC_AUTH}`,
      'Content-Type': 'application/xml',
      'User-Agent': this.USER_AGENT
    }
  };

  _validateHttpResponse(response) {
    console.log(response);
    if (response.status < 400) {
      return true;
    } else if (response.status === 401) {
      throw new AuthorizationError(`Not found: ${response.status}`);
    } else if (response.status === 404) {
      throw new RemoteNotFound(`Not found: ${response.status}`);
    } else if (response.status >= 500) {
      throw new RemoteSystemError(`Server error: ${response.status}`);
    }
  }

  async _httpGet(urlSuffix) {
    try {
      const response = await this._axios.get(urlSuffix);

      this._validateHttpResponse(response);

      return response;
    } catch (e) {
      throw AxiosError('Could not reach the API.')
    }
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

  _getJsonContent(data) {
    let content = null;

    _.forOwn(data, function(value, key) {
      if (key.startsWith('{http')) {
        content = data[key].value;
      }
    });

    return content;
  }

  async _httpGetJsonContent(urlSuffix) {
    try {
      const data = await this._httpGetData(urlSuffix)
      const content = this._getJsonContent(data);

      return content;
    } catch (e) {
      throw e;
    }
  }

  async _httpPut(urlSuffix, data = '') {
    try {
      const response = await this._axios.put(urlSuffix, data);

      this._validateHttpResponse(response);

      return response;
    } catch (e) {
      throw AxiosError('Could not reach the API.')
    }
  }

  async _httpDelete(urlSuffix, data = '') {
    try {
      const response = await this._axios.delete(urlSuffix);

      this._validateHttpResponse(response);

      return response;
    } catch (e) {
      throw AxiosError('Could not reach the API.')
    }
  }

  async _httpPost(urlSuffix, data = '') {
    try {
      const response = await this._axios.post(urlSuffix, data);

      this._validateHttpResponse(response);

      return response;
    } catch (e) {
      console.log(e);
      throw AxiosError('Could not reach the API.')
    }
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
    const urlSuffix = `/users/${this._email}/ads.json`;

    try {
      const content = await this._httpGetJsonContent(urlSuffix);
      const ad = content.ad;

      return ad;
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
      const content = await this._httpGetJsonContent(urlSuffix);

      return content;
    } catch (e) {
      throw e;
    }
  }

  async getCountWatchlist(id) {
    const urlSuffix = `/v2/counters/ads/watchlist?adIds=${id}`;

    try {
      const content = await this._httpGetJsonContent(urlSuffix);

      return content.counters[0];
    } catch (e) {
      throw e;
    }
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

      return result
    } catch (e) {
      throw e;
    }
  }

  async deactivateAd(id) {
    try {
      const result = await this._changeAdStatus(id, 'paused');

      return result
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

      return response;
    } catch (e) {
      throw e;
    }
  }

  async loginTest() {

    try {
      const ads = await this.getAds();

      return ads !== null;
    } catch (e) {
      throw e;
    }
  }
}



