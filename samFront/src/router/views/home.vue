<script>
import Layout from '@layouts/main'
import esriLoader from 'esri-loader'
import { ChartSunburst } from 'vue-d2b'
import { authComputed } from '@state/helpers'
// import { router } from 'vue-router'
import store from '@state/store'
import gql from 'graphql-tag'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'TestView' }],
  },
  components: { Layout, ChartSunburst },
  apollo: {
    apolloTest: {
      query: gql`query myQuery($id: String) {
        getScenario(id: $id) {
          getID
          getCreatedBy
          scenarioTreatments {
            treatmentID
            treatmentName
          }
        }
      }`,
      // query: gql`query { getMessage(id: "78bbd9fa0cdb14420ece") {
      //   author
      //   content
      // }}`,
      variables() {
        return {
          id: "630"
        }
      },
      update: function(data) {
        return data
      }
    }
  },
  watch: {
    apolloTest: function(x) {
      console.log(x)
    }
  },
  data() {
    return {
      apolloTest: '',
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length === 4 || 'Must be 4 characters',
        email: value => {
          const pattern = /^\d+$/
          return pattern.test(value) || 'ID must only contain numbers'
        },
      },
      scenarioID: '1234',
      scenarioMunicipalities: ['Barnstable', 'Sandwich', 'Mashpee'],
      scenarioSubEmbayments: [
        'Princes Cove',
        'Warrens Cove',
        'Upper North Bay',
        'Lower North Bay',
        'Cotuit Bay',
        'West Bay',
        'Eel Pond',
      ],
      percentageNRemovedToMeetTMDL: '97%',
      scenarioTechnologies: [
        'Fertilizer Management',
        'Stormwater Management',
        'Permeable Reactive Barrier (PRB)',
        'Dredging/Inlet Widening',
        'Ecotoilets',
        'Aquaculture/Oyster Beds',
      ],
      samScenarioCreated: false,
      dialog: true,
      scenarioInput: '',
      chartConfig: function(chart) {
        chart.chartFrame().size(function(d) {
          return d.x
        })
      },
      price: [110, 440],
      chartData: {
        label: 'weight',
        children: [
          {
            label: 'community',
            children: [
              {
                label: 'growth compatability',
                size: 1,
              },
              {
                label: 'construction and o&m jobs created',
                size: 3,
              },
              {
                label: 'property value loss avoided',
                size: 5,
              },
            ],
          },
          {
            label: 'cost',
            children: [
              {
                label: 'capital cost',
                size: 7,
              },
              {
                label: 'operation & maintenance cost',
                size: 9,
              },
              {
                label: 'life cycle cost',
                size: 11,
              },
            ],
          },
          {
            label: 'confidence',
            children: [
              {
                label: 'useful number of years',
                size: 13,
              },
              {
                label: 'variability in performance',
                size: 15,
              },
              {
                label: 'resiliency to flooding',
                size: 17,
              },
            ],
          },
        ],
      },
    }
  },
  computed: {
    ...authComputed,
    fullScenario() {
      return this.$route.params.scenario
    },
  },
  props: {
    scenario: {
      type: String,
      required: false,
      default: null,
    },
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
    toggleDialog() {
      if (!isNaN(this.scenarioInput) && this.scenarioInput.length === 4) {
        this.dialog = !this.dialog

        store.dispatch('users/updateScenarioID', {
          scenario: this.scenarioInput,
        })

        this.$router.push({
          name: 'scenario-home',
          params: { scenario: this.scenarioInput },
        })
      }
    },
    showSliderVal(val) {
      this.chartData.children[0].children[0].size = val[0]
      this.chartData.children[0].children[1].size = val[1]
      this.chartData.children[0].children[2].size = val[1] - val[0]

      console.log(val[0], val[1], val[1] - val[0])
    },
  },
}
</script>

<template>
  <Layout>
    <VDialog
      v-if="!$store.state.users.scenario"
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
            :rules="[rules.required, rules.email, rules.counter]"
            @keyup.enter="toggleDialog"
          />
        </VCardActions>
      </VCard>
    </VDialog>
    <VFlex
      v-if="$store.state.users.scenario"
      d-flex
    >
      <VCard
        color="grey"
        dark
        width="100%"
      >
        <VCardTitle
          primary-title
          class="pa-0 justify-center"
          word-wrap="break-word"
        >
          <h3>Scenario ID</h3>
        </VCardTitle>
        <VCardText
          class="pa-0"
        >
          <h5><strong>{{ scenarioID }}</strong></h5>
          <h5><strong>Treatments</strong></h5>
          <div v-for = "treatment in apolloTest.getScenario.scenarioTreatments">
            <h6>{{treatment.treatmentName}}</h6>
          </div>
        </VCardText>
      </VCard>
      <VCard
        color="grey"
        dark
        width="100%"
        class="scroll-y"
      >
        <VCardTitle
          primary-title
          class="pa-0 justify-center"
          word-wrap="break-word"
        >
          <h3>Municipalities</h3>
        </VCardTitle>
        <VCardText
          v-for="municipality in scenarioMunicipalities"
          :key="municipality"
          class="pa-0"
        >
          <h5><strong>{{ municipality }}</strong></h5>
        </VCardText>
      </VCard>
      <VCard
        color="grey"
        dark
        width="100%"
        class="scroll-y"
      >
        <VCardTitle
          primary-title
          class="pa-0 justify-center"
          word-wrap="break-word"
        >
          <h3>Subembayments</h3>
        </VCardTitle>
        <VCardText
          v-for="subEmbayment in scenarioSubEmbayments"
          :key="subEmbayment"
          primary-title
          class="pa-0"
        >
          <h5><strong>{{ subEmbayment }}</strong></h5>
        </VCardText>
      </VCard>
      <VCard
        color="grey"
        dark
        width="100%"
      >
        <VCardTitle
          primary-title
          class="pa-0 justify-center"
          word-wrap="break-word"
        >
          <h3>Percentage N Removed to Meet TMDL</h3>
        </VCardTitle>
        <VCardText
          primary-title
          class="pa-0"
        >
          <h5><strong>{{ percentageNRemovedToMeetTMDL }}</strong></h5>
        </vcardtext>
      </VCard>
      <VCard
        color="grey"
        dark
        width="100%"
        class="scroll-y"
      >
        <VCardTitle
          primary-title
          class="pa-0 justify-center"
          word-wrap="break-word"
        >
          <h3>Wastewater Technologies</h3>
        </VCardTitle>
        <VCardText
          v-for="technology in scenarioTechnologies"
          :key="technology"
          primary-title
          class="pa-0"
        >
          <h5><strong>{{ technology }}</strong></h5>
        </VCardText>
      </VCard>
      <VCard
        color="grey"
        dark
        width="100%"
      >
        <VBtn
          v-if="!samScenarioCreated"
          small
          color="indigo"
          dark
          class="ma-5"
          @click="samScenarioCreated = !samScenarioCreated"
        >
          <VIcon dark>
            save
          </VIcon>
        </VBtn>
        <VBtn
          v-else
          small
          color="green"
          dark
          class="ma-5"
        >
          <VIcon dark>
            check
          </VIcon>
        </VBtn>
      </VCard>
    </VFlex>

    <!-- when implementing v-if="dialog === false" in VFlex below, map not rendering -->
    <VFlex
      v-if="$store.state.users.scenario"
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
        <VRangeSlider
          v-model="price"
          color="black"
          :max="100"
          :min="1"
          :step="1"
          @end="showSliderVal"
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