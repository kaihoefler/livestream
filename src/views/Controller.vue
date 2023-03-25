<template>
  <div id="controller" class="router">
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
      <div class="column">
        <Preview />
        <br />
        <Presets />
      </div>

    </div>
  </div>
</template>

<style >
  #controller {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>

<script>
// @ is an alias to /src
import Settings from '@/components/settings/Settings.vue'
import TimeRaceSettings from '@/components/settings/TimeRaceSettings.vue'
import CountdownSettings from '@/components/settings/FlipCountdownSettings.vue'
import TickerSettings from '@/components/settings/TickerSettings.vue'
import PointsRaceSettings from '@/components/settings/PointsRaceSettings.vue'
import Presets from '@/components/settings/Presets.vue'
import Preview from '@/components/settings/Preview.vue'

export default {
  name: 'Controller',
  components: {
    Settings,
    TimeRaceSettings,
    CountdownSettings,
    TickerSettings,
    PointsRaceSettings,
    Presets,
    Preview
  },
  mounted () {
    require('@/assets/traina_bulma.css')
  }
}
</script>
