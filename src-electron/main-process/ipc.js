import { ipcMain } from 'electron';
import { getAds, loginTest, adPause, adResume, adDelete, adTopUp, getProfile } from './kleinanzeigen-workflow';
import settings from 'electron-settings';


const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:81.0) Gecko/20100101 Firefox/81.0';

ipcMain.on('r-get-ads', async (event, args) => {
  try {
    const ads = await getAds();

    event.reply('m-get-ads', ads);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-ad-pause', async (event, args) => {
  try {
    const status = await adPause(args.id);

    event.reply('m-ad-pause', status);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-ad-resume', async (event, args) => {
  try {
    const status = await adResume(args.id);

    event.reply('m-ad-resume', status);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-ads-delete', async (event, args) => {
  try {
    const status = await adDelete(args.id);

    event.reply('m-ads-delete', status);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-login', async (event, args) => {
  try {
    const status = await loginTest();
    await settings.set('isLogin', status);

    event.reply('m-login', status);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-ads-topup', async (event, args) => {
  try {
    const status = await adTopUp(args.id, args.price);

    event.reply('m-ads-topup', status);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('r-get-profile', async (event, args) => {
  try {
    const profile = await getProfile();

    event.reply('m-get-profile', profile);
  } catch (e) {
    console.log(e);
  }
});
