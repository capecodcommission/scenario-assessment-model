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
    scoresGraphql: {
      query: gql`query myQuery($id: String) {
        getScores(id: $id) {
          getID
          capitalCost
          omCost
          lcCost
          growthComp
          jobs
          varPerf
          floodRatio
          pvla
          years
        }
      }`,
      variables() {
        return {
          id: this.queryInput
        }
      },
      update: function(data) {
        return data
      },
      skip() {
        return !this.queryInput
      }
    },
    summaryData: {
      query: gql `query myQuery($id: String) {
        getSummary(id: $id) {
          towns {
            name
          }
          subEmbayments {
            name
          }
          treatments {
            treatmentName
          }
        }
      }`,
      variables() {
        return {
          id: this.queryInput
        }
      },
      update: function(data) {
        return data
      },
      skip() {
        return !this.queryInput
      }
    }
  },
  watch: {
    scoresGraphql: function(x) {

      this.chartData.children[0].children[0].size = x.getScores.growthComp
      this.chartData.children[0].children[1].size = x.getScores.jobs
      this.chartData.children[0].children[2].size = x.getScores.pvla

      this.chartData.children[1].children[0].size = x.getScores.capitalCost
      this.chartData.children[1].children[1].size = x.getScores.omCost
      this.chartData.children[1].children[2].size = x.getScores.lcCost

      this.chartData.children[2].children[0].size = x.getScores.years
      this.chartData.children[2].children[1].size = x.getScores.varPerf
      this.chartData.children[2].children[2].size = x.getScores.floodRatio

      this.scenarioID = x.getScores.getID

    },
    summaryData: function(x) {
      this.scenarioMunicipalities = x.getSummary.towns
      this.scenarioSubEmbayments = x.getSummary.subEmbayments
      this.scenarioTechnologies = x.getSummary.treatments
    }
  },
  data() {
    return {
      summaryData: '',
      scoresGraphql: '',
      rules: {
        required: value => !!value || 'Required.',
        counter: value => 3 >= value.length && value.length <= 4 || 'Must be 3-4 digits',
        email: value => {
          const pattern = /^\d+$/
          return pattern.test(value) || 'ID must only contain digits'
        },
      },
      scenarioID: '',
      scenarioMunicipalities: [],
      scenarioSubEmbayments: [],
      percentageNRemovedToMeetTMDL: '97%',
      scenarioTechnologies: [],
      samScenarioCreated: false,
      dialog: true,
      scenarioInput: '',
      queryInput: '',
      chartConfig: function(chart) {
        chart.chartFrame().size(function(d) {
          return d.x
        })
      },
      subCatSliderVal: [33, 66],
      communitySliderVal: [33, 66],
      costSliderVal: [33, 66],
      confidenceSliderVal: [33, 66],
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
    }
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

    if (store.state.users.scenario) {this.queryInput = store.state.users.scenario}
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
    modifySubCatSliderVal(val) {

      var commWeight = val[0] / 100
      var newGrowthCompSliderVal = commWeight *  (this.communitySliderVal[0] / 100) * this.scoresGraphql.getScores.growthComp
      var newJobsSliderVal = commWeight *  ( (this.communitySliderVal[1] - this.communitySliderVal[0]) / 100) * this.scoresGraphql.getScores.jobs
      var newPvlaSliderVal = commWeight *  ( (100 - this.communitySliderVal[1]) / 100) * this.scoresGraphql.getScores.pvla

      var costWeight = (val[1] - val[0]) / 100
      var newCapSliderVal = costWeight *  (this.costSliderVal[0] / 100) * this.scoresGraphql.getScores.capitalCost
      var newOmSliderVal = costWeight *  ( (this.costSliderVal[1] - this.costSliderVal[0]) / 100) * this.scoresGraphql.getScores.omCost
      var newLcSliderVal = costWeight *  ( (100 - this.costSliderVal[1]) / 100) * this.scoresGraphql.getScores.lcCost

      var confWeight = (100 - val[1]) / 100
      var newYearsSliderVal = confWeight *  (this.confidenceSliderVal[0] / 100) * this.scoresGraphql.getScores.years
      var newVarpSliderVal = confWeight *  ( (this.confidenceSliderVal[1] - this.confidenceSliderVal[0]) / 100) * this.scoresGraphql.getScores.varPerf
      var newFloodSliderVal = confWeight *  ( (100 - this.confidenceSliderVal[1]) / 100) * this.scoresGraphql.getScores.floodRatio

      this.chartData.children[0].children[0].size = newGrowthCompSliderVal * 10
      this.chartData.children[0].children[1].size = newJobsSliderVal * 10
      this.chartData.children[0].children[2].size = newPvlaSliderVal * 10

      this.chartData.children[1].children[0].size = newCapSliderVal * 10
      this.chartData.children[1].children[1].size = newOmSliderVal * 10
      this.chartData.children[1].children[2].size = newLcSliderVal * 10

      this.chartData.children[2].children[0].size = newYearsSliderVal * 10
      this.chartData.children[2].children[1].size = newVarpSliderVal * 10
      this.chartData.children[2].children[2].size = newFloodSliderVal * 10
    },
    modifyCommunity(val) {

      var commWeight = this.subCatSliderVal[0] / 100
      var growthCompSliderVal = commWeight * ( val[0] / 100 ) * this.scoresGraphql.getScores.growthComp
      var jobsSliderVal = commWeight * ( (val[1] - val[0]) / 100 ) * this.scoresGraphql.getScores.jobs
      var pvlaSliderVal = commWeight * ( (100 - val[1]) / 100 ) * this.scoresGraphql.getScores.pvla


      this.chartData.children[0].children[0].size = growthCompSliderVal * 10
      this.chartData.children[0].children[1].size =  jobsSliderVal * 10
      this.chartData.children[0].children[2].size = pvlaSliderVal * 10
    },
    modifyCost(val) {

      var costWeight = (this.subCatSliderVal[1] - this.subCatSliderVal[0]) / 100
      var capSliderVal = costWeight * ( val[0] / 100 ) * this.scoresGraphql.getScores.capitalCost
      var omSliderVal = costWeight * ( (val[1] - val[0]) / 100 ) * this.scoresGraphql.getScores.omCost
      var lcSliderVal = costWeight * ( (100 - val[1]) / 100 ) * this.scoresGraphql.getScores.lcCost

      this.chartData.children[1].children[0].size = capSliderVal * 10
      this.chartData.children[1].children[1].size = omSliderVal * 10
      this.chartData.children[1].children[2].size = lcSliderVal * 10
    },
    modifyConfidence(val) {

      var confWeight = (100 - this.subCatSliderVal[1]) / 100
      var yearsSliderVal = confWeight * ( val[0] / 100 ) * this.scoresGraphql.getScores.years
      var varpSliderVal = confWeight * ( (val[1] - val[0]) / 100 ) * this.scoresGraphql.getScores.varPerf
      var floodSliderVal = confWeight * ( (100 - val[1]) / 100 ) * this.scoresGraphql.getScores.floodRatio

      this.chartData.children[2].children[0].size = yearsSliderVal * 10
      this.chartData.children[2].children[1].size = varpSliderVal * 10
      this.chartData.children[2].children[2].size = floodSliderVal * 10
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
          :key="municipality.name"
          class="pa-0"
        >
          <h5><strong>{{ municipality.name }}</strong></h5>
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
          :key="subEmbayment.name"
          primary-title
          class="pa-0"
        >
          <h5><strong>{{ subEmbayment.name }}</strong></h5>
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
          :key="technology.treatmentName"
          primary-title
          class="pa-0"
        >
          <h5><strong>{{ technology.treatmentName }}</strong></h5>
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
          v-model="subCatSliderVal"
          color="black"
          :max="100"
          :min="1"
          :step="1"
          @end="modifySubCatSliderVal"
        />
        <VRangeSlider
          v-model="communitySliderVal"
          color="black"
          :max="100"
          :min="1"
          :step="1"
          @end="modifyCommunity"
        />
        <VRangeSlider
          v-model="costSliderVal"
          color="black"
          :max="100"
          :min="1"
          :step="1"
          @end="modifyCost"
        />
        <VRangeSlider
          v-model="confidenceSliderVal"
          color="black"
          :max="100"
          :min="1"
          :step="1"
          @end="modifyConfidence"
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
