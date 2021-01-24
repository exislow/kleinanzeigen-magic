<template lang="pug">
  q-item(clickable, tag="a", :to="{ name: toName }", exact)
    q-item-section(v-if="icon" avatar)
      q-icon(:name="icon")
    q-item-section
      q-item-label {{ title }}
</template>

<script>

export default {
  name: 'MenuLinks',
  props: {
    title: {
      type: String,
      required: true
    },
    toName: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
