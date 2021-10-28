import { RemoteSystemError, AuthorizationError, RemoteNotFound, AttributeError, AxiosError } from './exceptions';
import { readFile } from 'fs';

export const generateExceptionStr = (exc) => {
  return `${exc.name}: ${exc.message}`
}

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
}

export const readFileAsync = async function (path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}
