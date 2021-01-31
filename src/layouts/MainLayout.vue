<template lang="pug">
  #main-layout
    q-header(elevated)
      q-toolbar
        q-btn(flat, dense, round, icon="menu", aria-label="Menu", @click="leftDrawerOpen = !leftDrawerOpen")
        q-toolbar-title
          | Kleinanzeigen Magic
    q-drawer(v-model="leftDrawerOpen", show-if-above, bordered, no-swipe-close, overlay)
      q-scroll-area(style="height: calc(100% - 150px); margin-top: 150px;")
        q-list
          q-item-label(header)
            | Menü
          MenuLinks(v-for="link in essentialLinks" :key="link.to" v-bind="link")
          MenuLinks(v-if="!isLogin" v-bind="link.login")
          MenuLinks(v-else v-bind="link.logout")
      q-img.absolute-top(src="~assets/material.png" style="height: 150px")
        .absolute-bottom.bg-transparent(v-if="isLogin && profile != null")
          q-list(dense)
            q-item(dense)
              q-item-section
                q-icon(name="tag_faces")
              q-item-section
                | {{ Math.round(profile.userRatings.averageRating * 100) }}%
              q-item-section
                q-icon(name="keyboard_return")
              q-item-section
                | {{ profile.replyIndicators.replyRate }}
            q-item
              q-item-section
                q-icon(name="people")
              q-item-section
                | {{ profile.counters.followers }}
              q-item-section
                q-icon(name="local_offer")
              q-item-section
                | {{ profile.counters.onlineAds }}
          q-btn(flat, dense, @click="openExternal(profile.webUrl)") {{ profile.preferences.contactName }}
          div {{ email }}
        .absolute-bottom.bg-transparent(v-else)
          q-skeleton(type="text")
          q-skeleton(type="text")
          q-skeleton(type="text")
</template>

<script>
import MenuLinks from 'components/MenuLinks.vue';
import { user } from 'src/mixins/user';
import { electronHelper } from 'src/mixins/electronHelper';

const linksData = [
  {
    title: 'Meine Anzeigen',
    icon: 'view_list',
    toName: 'overview'
  }
];

export default {
  name: 'MainLayout',
  components: { MenuLinks },
  mixins: [ user, electronHelper ],
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      link: {
        login: {
          title: 'Login',
          icon: 'login',
          toName: 'index'
        },
        logout: {
          title: 'Logout',
          icon: 'cancel',
          toName: 'logout'
        }
      }
    }
  }
}
</script>
