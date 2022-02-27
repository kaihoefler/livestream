<template>
  <div class="card is-info">
    <header class="card-header notification is-success">
      <p class="card-header-title">
        Global Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label class="label">URL of Race Timing Service (Leaderboard)</label>
        <input v-model="settings.urlRaceService" class="input" type="text" placeholder="Text input">
      </div>
      <div class="field">
        <label class="label">Race Service Update Interval (ms)</label>
        <input v-model="settings.updateInterval" class="input" type="number">
      </div>
      <div class="field">
        <label class="label">URL of Points Service (Punkterennen)</label>
        <input v-model="settings.urlPointsService" class="input" type="text" placeholder="Text input">
      </div>
      <div class="field">
        <label class="label">Points Service Update Interval (ms)</label>
        <input v-model="settings.updateIntervalPoints" class="input" type="number">
      </div>     <div class="field">
        <label class="label">Lap Distance (km)</label>
        <input v-model="settings.lapDistance" class="input" type="number" step="any" min="0" max="100">
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="saveSettings" :disabled=!isDirty class="button is-primary">Save Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'Settings',
  props: {
    msg: String
  },
  computed: {
    // use read only -> Values come from the store
    storeSettings () {
      return this.$store.state.settings
    },
    // for each updateable attribute from the store we need to create getters and setters
    urlRaceService: {
      get () {
        return this.$store.state.settings.urlRaceService
      },
      set (value) {
        this.$store.commit('updateUrlRaceservice', value)
      }
    }

  },

  data: function () {
    return {
      settings: {
        urlRaceService: '',
        updateInterval: 0,
        lapDistance: 0
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
      this.$store.commit('setSettings', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.settings)
      this.isDirty = false
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.settings)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
