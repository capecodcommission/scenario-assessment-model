<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes.vue'
import store from '@state/store'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      persistentNavRoutes: [
        {
          name: 'scenario-home',
          title: 'Home',
          params: { scenario: store.state.users.scenario },
        },
      ],
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.name,
        },
        {
          name: 'logout',
          title: 'Log out',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
}
</script>

<template>
  <VFlex>
    <VFooter
      height="auto"
      color="primary lighten-1"
    >
      <VLayout
        justify-center
        row
        wrap
      >
        <ul :class="$style.container">
          <NavBarRoutes :routes="persistentNavRoutes" />
          <NavBarRoutes
            v-if="loggedIn"
            :routes="loggedInNavRoutes"
          />
          <NavBarRoutes
            v-else
            :routes="loggedOutNavRoutes"
          />
        </ul>
      </VLayout>
    </VFooter>
  </VFlex>
</template>

<style lang="scss" module>
@import '@design';

.container {
  padding: 0;
  margin: 0 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>
