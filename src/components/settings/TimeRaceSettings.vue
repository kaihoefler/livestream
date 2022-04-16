<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title is-info">
        Time Race Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label style="center" class="checkbox"><input v-model="settings.show" type="checkbox"> Show time race visualization</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showRaceName" type="checkbox"> Show race name</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showRaceTime" type="checkbox"> Show race time</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showLaps" type="checkbox"> Show lap counter</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showLapTimes" type="checkbox"> Show lap time list</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showBestLapTimes" type="checkbox"> Show best lap times (Dobbin)</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showStartlist" type="checkbox"> Show Startlist (bevore Race)</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showResults" type="checkbox"> Show Results (after Finish)</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.resultsSortedByBestTime" type="checkbox"> Sort Results by best Lap</label>
      </div>
      <div class="field">
        <p><label class="checkbox"> Solid Background style</label></p>
        <p><label class="checkbox"><input v-model="settings.styleWhiteBG.raceName" type="checkbox"> Race Name</label></p>
        <p><label class="checkbox"><input v-model="settings.styleWhiteBG.laps" type="checkbox"> Laps Counter/Time</label></p>
        <p><label class="checkbox"><input v-model="settings.styleWhiteBG.results" type="checkbox"> Results</label></p>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showSpeed" type="checkbox"> Show avg. speed</label>
      </div>
      <div v-bind:class="{ 'is-hidden': !settings.showSpeed }">
        <div class="field">
          <label class="checkbox"><input v-model="settings.showRefSpeed" type="checkbox"> Show diff to reference speed</label>
        </div>
        <div class="field">
          <label class="label">Reference Speed</label>
          <input v-model="settings.refSpeed" class="input" type="number" step="any" min="0" max="100">
        </div>
      </div>
      <div class="field">
        <label class="label">Num. of lines to show</label>
        <input v-model="settings.numLapTimes" class="input" type="number" step="1" min="1" max="20">
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.pauseRaceUpdate" type="checkbox"><span v-bind:class="{ 'has-text-danger has-text-weight-semibold': settings.pauseRaceUpdate }"> Pause Race Update</span></label>
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="activateSettings" :disabled=!isDirty class="button is-primary">Activate Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'TimeRaceSettings',
  props: {
    msg: String
  },

  data: function () {
    return {
      settings: {
        show: true,
        showRefSpeed: false,
        refSpeed: 0,
        showRaceName: true,
        showLapTimes: true,
        showBestLapTimes: false,
        showRaceTime: true,
        showLaps: true,
        showSpeed: true,
        styleWhiteBG: {
          raceName: false,
          laps: false,
          results: false
        },
        numLapTimes: 5,
        showStartlist: false,
        showResults: false,
        resultsSortedByBestTime: false,
        pauseRaceUpdate: false
      },

      isDirty: false
    }
  },

  computed: {
    dataToWriteToForm () {
      // read the data from the store for the TimeRaceController
      return this.$store.state.presets.dataToWriteToTimeRaceController
    }
  },

  watch: {
    settings: {
      handler (val, oldVal) {
        this.isDirty = true
        // console.log('handler for settings: val=' + JSON.stringify(val) + ' oldVal = ' + JSON.stringify(oldVal))
        // we write the current form data to the store (to be used for Presets)
        this.$store.commit('setDisplayControlTimeRaceFormData', this.settings)
      },
      deep: true
    },
    dataToWriteToForm: {
      handler (val, oldVal) {
        if (val.activateTimeRaceData || val.loadTimeRaceData) {
          if (val.timeRaceData) {
            Object.assign(this.settings, val.timeRaceData)
          }
        }
        if (val.activateTimeRaceData) {
          this.activateSettings()
        }
        this.$store.commit('resetTimeRaceDataToWrite', null)
      },
      deep: true
    }
  },

  methods: {
    activateSettings () {
      this.$store.commit('setDisplayControlTimeRace', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.displayControl.timeRace)
      this.$store.commit('setDisplayControlTimeRaceFormData', this.settings)
      this.isDirty = false
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.displayControl.timeRace)
    this.$store.commit('setDisplayControlTimeRaceFormData', this.settings)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
