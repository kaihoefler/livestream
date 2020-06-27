<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title is-info">
        Timer Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label style="center" class="checkbox"><input v-model="settings.show" type="checkbox"> Show timer visualization</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showSeconds" type="checkbox"> Show seconds</label>
      </div>
      <div class="field">
        <label class="label">Target Time</label>
        <input v-model="settings.targetTime" class="input" type="text" placeholder="hh:mm:ss" >
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
