<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: '404',
    meta: [{ name: 'description', content: '404' }],
  },
  components: { Layout },
  props: {
    resource: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <Layout>
    <VFlex
      d-flex
      justfy-center
    >
      <VCard
        to="/"
        width="100%"
      >
        <VImg
          contain
          src="https://www.lifewire.com/thmb/qLv10Pgd30kCy7OxXacwOWKxZ8M=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/shutterstock_325494917-5a68d8403418c600190a3e1f.jpg"
        />
      </VCard>
    </VFlex>
  </Layout>
</template>

<style lang="scss" module>
.title {
  text-align: center;
}
</style>
