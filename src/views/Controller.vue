<template>
  <div class="router">
    <div id="nav">
      <router-link to="/vis" target="_blank"> Open Visualization Page</router-link>
    </div>

    <h1>This is the Livestream controller </h1>
    <div class="columns">
      <div class="column is-one-quarter">
          <Settings /> <br />
          <CountdownSettings /> <br />
          <TickerSettings />
      </div>
      <div class="column is-one-quarter"><TimeRaceSettings /><br />
          <PointsRaceSettings /></div>
      <div class="column"><Presets /><br />
          </div>
    </div>
  </div>
</template>

<style >
  /* @import '@/assets/traina_bulma.css';
  /* <link rel="stylesheet" href="<%= BASE_URL %>css/traina_bulma.css">
    <link rel="stylesheet" href="<%= BASE_URL %>css/font-awesome.min.css">
    */
</style>

<script>
// @ is an alias to /src
import Settings from '@/components/settings/Settings.vue'
import TimeRaceSettings from '@/components/settings/TimeRaceSettings.vue'
import CountdownSettings from '@/components/settings/FlipCountdownSettings.vue'
import TickerSettings from '@/components/settings/TickerSettings.vue'
import PointsRaceSettings from '@/components/settings/PointsRaceSettings.vue'
import Presets from '@/components/settings/Presets.vue'

export default {
  name: 'Controller',
  components: {
    Settings,
    TimeRaceSettings,
    CountdownSettings,
    TickerSettings,
    PointsRaceSettings,
    Presets
  },
  mounted () {
    require('@/assets/traina_bulma.css')
  }
}
</script>
