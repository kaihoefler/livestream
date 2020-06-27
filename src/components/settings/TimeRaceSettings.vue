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
        <label class="checkbox"><input v-model="settings.showLaps" type="checkbox"> Show laps</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showLapTimes" type="checkbox"> Show lap times</label>
      </div>
      <div class="field">
        <label class="label">Number of lap times</label>
        <input v-model="settings.numLapTimes" class="input" type="number" step="1" min="1" max="20">
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showSpeed" type="checkbox"> Show speed</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showRefSpeed" type="checkbox"> Show diff to reference speed</label>
      </div>
      <div class="field">
        <label class="label">Reference Speed</label>
        <input v-model="settings.refSpeed" class="input" type="number" step="any" min="0" max="100">
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.styleWhiteBG" type="checkbox"> Activate White Background style</label>
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="saveSettings" :disabled=!isDirty class="button is-primary">Save Time Race Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Time Race Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'TimeRaceSettings',
  props: {
    msg: String
  },
  computed: {
    // use read only -> Values come from the store
    storeSettings () {
      return this.$store.state.displayControl.timeRace
    }

  },

  data: function () {
    return {
      settings: {
        show: true,
        showRefSpeed: false,
        refSpeed: 0,
        showRaceName: true,
        showLapTimes: true,
        showRaceTime: true,
        showLaps: true,
        showSpeed: true,
        styleWhiteBG: false,
        numLapTimes: 5
      },

      isDirty: false
    }
  },

  watch: {
    settings: {
      handler (val, oldVal) {
        this.isDirty = true
      },
      deep: true
    }
  },

  methods: {
    saveSettings () {
      this.$store.commit('setDisplayControlTimeRace', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.displayControl.timeRace)
      this.isDirty = false
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.displayControl.timeRace)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
