<template lang="pug">
  q-page
    .row.q-gutter-y-sm
      .col
        q-btn-group(spread)
          q-btn(@click="openExternal('https://www.ebay-kleinanzeigen.de/')", icon="language", label="Kleinanzeigen Portal")
          q-btn(@click="getAds()", icon="refresh", label="Anzeigen")
    .row.q-pa-md.q-gutter-y-sm(v-if="!adsLoading", v-for="ad in ads", :key="ad.id")
      .col-12
        q-card
          q-card-section(horizontal)
            .row.ad-img-box.items-center
              q-img.ad-img.rounded-borders(:src="('pictures' in ad) ? ad.pictures.picture[0].link[2].href : 'na.png'", sizes="150px", spinner-color="primary",
                :class="{ 'ad-img-inactive': ad['ad-status'].value !== 'ACTIVE', 'ad-img-na': !('pictures' in ad)}")
                template(v-slot:error)
                  .absolute-full.flex.flex-center.bg-blue-grey.text-white
                    | Image N/A
                .absolute-bottom.text-subtitle1.text-center(v-if="ad['ad-status'].value !== 'ACTIVE'") {{ad['ad-status'].value}}
            q-list
              q-item(clickable, @click="openExternal(ad.link[2].href)")
                q-item-section(avatar)
                  q-icon(name="language")
                q-item-section
                  q-item-label {{ heDecode(ad.title.value) }}
              q-item
                q-item-section(avatar)
                  q-icon(name="error")
                q-item-section
                  q-item-label {{ formattedAdPrice(ad) }}
                    q-icon.on-left.on-right(name="visibility")
                    | {{ ad.count_view }}
                    q-icon.on-left.on-right(name="star")
                    | {{ ad.count_watch}}
                    q-icon.on-left.on-right(name="event")
                    | {{ formatStartDateTime(ad['start-date-time']) }}
              q-item
                q-item-section(avatar)
                q-item-section
                  q-btn-group(outline)
                    q-btn(flat, :icon="ad['ad-status'].value == 'ACTIVE' ? 'public_off' : 'public'", @click="adPauseResume(ad['ad-status'].value == 'ACTIVE' ? 'pause' : 'resume', ad.id)")
                      q-tooltip Anzeige deaktivieren.
                    q-btn(outline, color="green", @click="dialogTopUpShow(ad)")
                      q-icon.rotate-270(name="double_arrow")
                      q-tooltip Anzeige gratis nach oben schieben.
                    q-btn(flat, color="red", icon="delete_forever", @click="dialogDeleteShow(ad)")
                      q-tooltip Anzeige löschen.
    .row.q-pa-md.q-gutter-y-sm(v-if="adsLoading", v-for="i in 3", :key="Math.random()")
      .col-12
        q-card
          q-card-section(horizontal)
            .row.ad-img-box.items-center
              q-skeleton(height="170px", width="200px", square)
            q-list
              q-item
                q-skeleton.text-subtitle1(type="text", width="200px")
              q-item
                q-skeleton.text-subtitle1(type="text", width="150px")
              q-item
                q-skeleton.text-subtitle1(type="text", width="200px")
    q-dialog(v-model="confirmDelete.show" persistent)
      q-card
        q-card-section.row.items-center
          q-avatar(icon="delete_forever", color="primary", text-color="white")
          span.q-ml-sm Möchtest du wirklich folgende Anzeige löschen?
          | {{confirmDelete.title}}
        q-card-actions(align="right")
          q-btn(flat, label="Abbrechen", color="primary", v-close-popup, @click="")
          q-btn(flat, label="Löschen", color="negative", v-close-popup, @click="adsDelete(confirmDelete.id)" )
    q-dialog(v-model="confirmTopUp.show" persistent)
      q-card(style="min-width: 350px")
        q-card-section
          .text-h6 Preis ändern?
        q-card-section.q-pt-none
          q-input(dense, v-model="confirmTopUp.price", autofocus, @keyup.enter="adsTopUp(confirmTopUp.id, confirmTopUp.price)")
            template(v-slot:prepend)
              q-icon(name="euro_symbol")
        q-card-actions.text-primary(align="right")
          q-btn(flat, label="Abbrechen", color="primary", v-close-popup, @click="dialogTopUpHide")
          q-btn(flat, label="Top Up", color="positive", v-close-popup, @click="adsTopUp(confirmTopUp.id, confirmTopUp.price)")
</template>

<script>
import { ek } from 'src/mixins/ek'
import { user } from 'src/mixins/user'
import { electronHelper } from 'src/mixins/electronHelper'
import he from 'he';

export default {
  name: 'PageOverview',
  mixins: [ek, user, electronHelper],

  data () {
    return {
      confirmDelete: {
        show: false,
        id: null,
        title: null
      },
      confirmTopUp: {
        show: false,
        id: null,
        price: null
      },
      adsLoading: false,
    }
  },

  mounted: function () {
    this.$q.electron.ipcRenderer.on('m-get-ads', (event, arg) => {
      this.ads = arg
      this.adsLoading = false
    })

    this.$q.electron.ipcRenderer.on('m-ad-pause', (event, arg) => {
      this.getAds()
    })

    this.$q.electron.ipcRenderer.on('m-ad-resume', (event, arg) => {
      this.getAds()
    })

    this.$q.electron.ipcRenderer.on('m-ads-delete', (event, arg) => {
      if (arg.success === true) {
        this.ads = arg.data
      }
    })

    this.$q.electron.ipcRenderer.on('m-ads-topup', (event, arg) => {
      if (arg === true) {
        this.$toasted.success('Die Anzeige wurde erfolgreich nach oben geschoben.');
        this.getAds();
      } else {
        this.$toasted.error('Oops. Da ist etwas schief gelaufen.');
      }
    })

    if (this.ads != undefined) {
      if (this.ads.length === 0) {
        this.getAds()
      }
    } else {
      this.getAds()
    }
  },
  methods: {
    getAds: async function () {
      this.adsLoading = true
      this.ads = []
      this.$q.electron.ipcRenderer.send('r-get-ads')
    },

    adPauseResume: function (mode, adId) {
      const args = {
        id: adId
      }
      this.$q.electron.ipcRenderer.send(`r-ad-${mode}`, args)
    },

    dialogDeleteShow: function (ad) {
      this.confirmDelete.id = ad.id
      this.confirmDelete.title = ad.title.value
      this.confirmDelete.show = true
    },

    dialogDeleteHide () {
      this.confirmDelete.show = false
      this.confirmDelete.id = null
      this.confirmDelete.title = null
    },

    adsDelete: function (adId) {
      const args = {
        id: adId
      }
      this.$q.electron.ipcRenderer.send(`r-ads-delete`, args)
      this.dialogDeleteHide()
    },

    dialogTopUpShow (ad) {
      this.confirmTopUp.id = ad.id
      this.confirmTopUp.price = ad.price.amount.value
      this.confirmTopUp.show = true
    },

    dialogTopUpHide () {
      this.confirmTopUp.show = false
      this.confirmTopUp.id = null
      this.confirmTopUp.price = null
    },

    adsTopUp: function (adId, price) {
      const args = {
        id: adId,
        price: price
      }
      this.$q.electron.ipcRenderer.send(`r-ads-topup`, args)
      this.dialogTopUpHide()
    },
    formattedAdPrice (ad) {
      const { value: priceType } = ad.price['price-type']
      const isFreeItem = priceType === 'FREE'

      if (isFreeItem) {
        return 'zu verschenken'
      }

      const isNegotiable = priceType === 'PLEASE_CONTACT'
      const priceSuffix = isNegotiable ? ' (VB)' : ''

      const { value: amount } = ad.price.amount
      const currency = ad.price['currency-iso-code'].value['localized-label']
      return `${amount} ${currency}` + priceSuffix
    },
    heDecode (str) {
      return he.decode(str);
    },
    formatStartDateTime(adStartDateTime) {
      if ('value' in adStartDateTime) {
        return adStartDateTime.value.substring(0, 10);
      } else {
        return new Date().toISOString().substring(0, 10);
      }
    }
  }
}

</script>

<style lang="sass">
.ad-img-box
  width: 200px
  min-height: 150px

.ad-img
  width: 200px
  max-height: 150px

.ad-img-na
  width: 200px
  height: 150px

.ad-img-inactive
  filter: blur(1px) sepia(90)
</style>
