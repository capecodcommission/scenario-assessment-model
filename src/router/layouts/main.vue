<script>
import NavBar from '@components/nav-bar'
import store from '@state/store'

export default {
  components: { NavBar },
}
</script>

<template>
  <VContainer
    fill-height
    fluid
    pa-0
    text-xs-center
  >
    <VLayout
      column
    >
      <slot />
      <NavBar v-if="$store.state.users.scenario" />
    </VLayout>
  </VContainer>
</template>

<style lang="scss" module>
@import '@design';
</style>
