<script>
import NavBar from '@components/nav-bar'

export default {
  components: { NavBar },
}
</script>

<template>
  <VContainer
    fill-height
    fluid
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
</style>
