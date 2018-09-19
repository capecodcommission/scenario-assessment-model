<script>
import Layout from '@layouts/main'

export default {
  page() {
    return {
      title: this.user.name,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.name}.`,
        },
      ],
    }
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
    scenario: {
      type: String,
      required: false,
      default: null,
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
          <h1>
            <BaseIcon name="user" />
            {{ user.name }}
          </h1>
        </VCardTitle>
      </VCard>
      <VCard width="50%">
        {{ user }}
        {{ scenario }}
      </VCard>
    </VFlex>
  </Layout>
</template>
