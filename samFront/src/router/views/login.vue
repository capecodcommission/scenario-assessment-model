<script>
import Layout from '@layouts/main'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import store from '@state/store'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      password: '',
      authError: null,
      tryingToLogIn: false,
    }
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        username: this.username,
        password: this.password,
      })
        .then(token => {
          this.tryingToLogIn = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(
            this.$route.query.redirectFrom || {
              name: 'scenario-home',
              params: { scenario: store.state.users.scenario },
            }
          )
        })
        .catch(error => {
          this.tryingToLogIn = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
  <Layout>
    <VFlex
      d-flex
      fill-height
    >
      <VCard width="50%">
        <VCardTitle
          primary-title
          class="justify-center"
        >
          <h1>(CCC) Scenario Assessment Model</h1>
        </VCardTitle>
        <VImg
          height="500px"
          src="https://scontent.fzty2-1.fna.fbcdn.net/v/t1.0-9/969642_607269389291155_505660257_n.jpg?_nc_cat=0&oh=e821cd6a6eaca68a995fdfa11a9226d0&oe=5C17CB12"
          contain
        />
      </VCard>
    </VFlex>
    <VFlex
      d-flex
      fill-height
    >
      <VCard>
        <form
          :class="$style.form"
          @submit.prevent="tryToLogIn"
        >
          <BaseInput
            v-model="username"
            name="username"
          />
          <BaseInput
            v-model="password"
            name="password"
            type="password"
          />
          <BaseButton
            :disabled="tryingToLogIn"
            type="submit"
          >
            <BaseIcon
              v-if="tryingToLogIn"
              name="sync"
              spin
            />
            <span v-else>
              Log in
            </span>
          </BaseButton>
          <p v-if="authError">
            There was an error logging in to your account.
          </p>
        </form>
      </VCard>
    </VFlex>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
}
</style>
