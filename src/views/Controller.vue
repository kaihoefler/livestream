<template>
  <div class="router">
    <div id="nav">
      <router-link to="/vis" target="_blank"> Open Visualization</router-link>
    </div>

    <h1>This is the controller page</h1>
    <div class="columns">
      <div class="column"><Settings /></div>
      <div class="column"><TimeRaceSettings /></div>
    </div>
  </div>
</template>

<style >
  @import '/css/traina_bulma.css';
  /* <link rel="stylesheet" href="<%= BASE_URL %>css/traina_bulma.css">
    <link rel="stylesheet" href="<%= BASE_URL %>css/font-awesome.min.css">
    */
</style>

<script>
// @ is an alias to /src
import Settings from '@/components/Settings.vue'
import TimeRaceSettings from '@/components/TimeRaceSettings.vue'

export default {
  name: 'Controller',
  components: {
    Settings,
    TimeRaceSettings
  }

}
</script>
