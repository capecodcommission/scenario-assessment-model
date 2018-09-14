<script>
import NavBar from '@components/nav-bar'
import InfoBar from '@components/infoBar'

export default {
  components: { NavBar, InfoBar },
}
</script>

<template>
  <VContainer
    fill-height
    fluid
    pa-0
  >
    <VLayout
      column
    >
      <slot />
      <NavBar />
    </VLayout>
  </VContainer>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
}
</style>
