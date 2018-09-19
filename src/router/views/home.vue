<script>
import Layout from '@layouts/main'
import esriLoader from 'esri-loader'
import { ChartSunburst } from 'vue-d2b'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'TestView' }],
  },
  components: { Layout, ChartSunburst },
  data() {
    return {
      dialog: true,
      scenarioInput: '1234',
      chartConfig: function(chart) {
        chart.chartFrame().size(function(d) {
          return d.x
        })
      },
      chartData: {
        label: 'root',
        children: [
          {
            label: 'child 1',
            children: [
              {
                label: 'child 1-1',
                size: 10,
              },
              {
                label: 'child 1-2',
                children: [
                  {
                    label: 'child 1-2-1',
                    size: 5,
                  },
                  {
                    label: 'child 1-3-1',
                    size: 8,
                  },
                ],
              },
              {
                label: 'child 1-3',
                children: [
                  {
                    label: 'child 1-3-1',
                    children: [
                      {
                        label: 'child 1-3-1-1',
                        size: 2,
                      },
                      {
                        label: 'child 1-3-1-2',
                        size: 5,
                      },
                    ],
                  },
                  {
                    label: 'child 1-3-2',
                    size: 8,
                  },
                ],
              },
            ],
          },
          {
            label: 'child 2',
            size: 25,
          },
        ],
      },
    }
  },
  computed: {
    ...authComputed,
  },
  mounted: function() {
    this.startMap()
  },
  methods: {
    startMap() {
      esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css')
      esriLoader
        .loadModules(['esri/views/MapView', 'esri/Map', 'dojo/domReady!'])
        .then(([MapView, Map]) => {
          // then we load a web map from an id
          var webmap = new Map({
            basemap: 'streets',
          })
          // and we show that map in a container w/ id #viewDiv
          MapView({
            map: webmap,
            container: 'viewDiv',
            center: [-70.325284, 41.675269],
            zoom: 10,
          })
        })
        .catch(err => {
          // handle any errors
          console.error(err)
        })
    },
  },
}
</script>

<template>
  <Layout>
    <VDialog
      v-if="!loggedIn"
      v-model="dialog"
      content-class="text-center"
      persistent
      max-width="500px"
    >
      <VCard>
        <VCardTitle class="headline text-center">
          (CCC) Scenario Assessment Model
        </VCardTitle>
        <VImg
          gradient="to top right, rgba(100,115,201,.05), rgba(25,32,72,.2)"
          src="https://scontent.fzty2-1.fna.fbcdn.net/v/t1.0-9/969642_607269389291155_505660257_n.jpg?_nc_cat=0&oh=e821cd6a6eaca68a995fdfa11a9226d0&oe=5C17CB12"
        />
        <VCardText>This is the Cape Cod Commission's (SAM) Scenario Assessment Model Application which is developed using AngularJS + D3.js + Bootstrap connected to a Node.js API. The application receives computed data from the API which is triggered by wMVP scenario ID input into this SAM application on the client.</VCardText>
        <VCardActions>
          <VTextField
            v-model="scenarioInput"
            label="Enter Scenario ID"
            box
            @keyup.enter="dialog = !dialog"
          />
        </VCardActions>
      </VCard>
    </VDialog>
    <VFlex
      d-flex
    >
      <VCard
        color="grey"
        dark
        width="100%"
      >
        <VCardTitle
          primary-title
          class="justify-center"
        >
          <h1>SUMMARY SCENARIO INFO</h1>
        </VCardTitle>
      </VCard>
    </VFlex>
    <VFlex
      d-flex
      fill-height
    >
      <VCard
        width="60%"
      >
        <VCardTitle
          primary-title
          class="justify-center"
        >
          <h1>
            CHART
          </h1>
        </VCardTitle>
        <ChartSunburst
          :data="chartData"
        />
      </VCard>
      <VCard
        color="white"
        dark
        width="10%"
      >
        <VCardTitle
          primary-title
          class="justify-center"
        >
          <h1>CHART INFO</h1>
        </VCardTitle>
      </VCard>
      <VCard
        id="viewDiv"
        class="viewDiv"
        width="30%"
      />
    </VFlex>
  </Layout>
</template>

<style lang = 'scss'>
@import '@design';

.viewDiv {
  width: 100%;
  height: 100%;
}

/* .chartDiv {
  width: 100%;
  height: 100%;
} */

.vue-d2b-container {
  height: 50%;
}

@media screen and (max-width: 1000px) {
  .d2b-breadcrumbs-frame {
    display: none;
    width: 0 !important;
  }
}

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
  text-align: center;
}
</style>
