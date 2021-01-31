import { ipcMain } from 'electron';
import { getAds, loginTest, adPause, adResume, adDelete, adTopUp, getProfile } from './kleinanzeigen-workflow';
import { exceptionHandler } from './utilities.js';


ipcMain.on('r-get-ads', async (event, args) => {
  try {
    const ads = await getAds();

    event.reply('m-get-ads', ads);
  } catch (e) {
    exceptionHandler(e, event);
  }
});

ipcMain.on('r-ad-pause', async (event, args) => {
  try {
    const status = await adPause(args.id);

    event.reply('m-ad-pause', status);
  } catch (e) {
    exceptionHandler(e, event);
  }
});

ipcMain.on('r-ad-resume', async (event, args) => {
  try {
    const status = await adResume(args.id);

    event.reply('m-ad-resume', status);
  } catch (e) {
    exceptionHandler(e, event);
  }
});

ipcMain.on('r-ads-delete', async (event, args) => {
  try {
    const status = await adDelete(args.id);

    event.reply('m-ads-delete', status);
  } catch (e) {
    exceptionHandler(e, event);
  }
});

ipcMain.on('r-login', async (event, args) => {
  let status = false;
  try {
    status = await loginTest();

  } catch (e) {
    exceptionHandler(e, event);
  }

  event.reply('m-login', status);
});

ipcMain.on('r-ads-topup', async (event, args) => {
  try {
    const status = await adTopUp(args.id, args.price);

    event.reply('m-ads-topup', status);
  } catch (e) {
    exceptionHandler(e, event);
  }
});

ipcMain.on('r-get-profile', async (event, args) => {
  try {
    const profile = await getProfile();

    event.reply('m-get-profile', profile);
  } catch (e) {
    exceptionHandler(e, event);
  }
});
