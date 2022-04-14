<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title is-info">
        Points / Elimination Race Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label style="center" class="checkbox"><input v-model="settings.show" type="checkbox"> Show points (elim?) race visualization</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showPoints" type="checkbox"> Show points</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showElims" type="checkbox"> Show eliminations</label>
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showResults" type="checkbox"> Show Results</label>
      </div>
      <div class="field">
        <label class="label">Number of points/elims to show</label>
        <input v-model="settings.numElimsToShow" class="input" type="number" step="1" min="1" max="20">
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.styleWhiteBG" type="checkbox"> Activate White Background style</label>
      </div>
<!--      <div class="field">
        <label class="checkbox"><input v-model="settings.pausePointsUpdate" type="checkbox"><span v-bind:class="{ 'has-text-danger has-text-weight-semibold': settings.pausePointsUpdate }"> Pause Points Update</span></label>
      </div> -->
    </div>
    <footer class="card-footer">
      <button v-on:click="activateSettings" :disabled=!isDirty class="button is-primary">Activate Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'PointsRaceSettings',
  props: {
    msg: String
  },
  computed: {
    // use read only -> Values come from the store
    storeSettings () {
      return this.$store.state.displayControl.pointsRace
    },

    dataToWriteToForm () {
      // read the data from the store for the TimeRaceController
      return this.$store.state.presets.dataToWriteToPointsRaceController
    }

  },

  data: function () {
    return {
      settings: {
        showPoints: true,
        showElims: true,
        styleWhiteBG: false,
        numElimsToShow: 15,
        showResults: false,
        pausePointsUpdate: false
      },

      isDirty: false
    }
  },

  watch: {
    settings: {
      handler (val, oldVal) {
        this.isDirty = true
        // we write the current form data to the store (to be used for Presets)
        this.$store.commit('setDisplayControlPointsRaceFormData', this.settings)
      },
      deep: true
    },

    dataToWriteToForm: {
      handler (val, oldVal) {
        if (val.activatePointsRaceData || val.loadPointsRaceData) {
          if (val.pointsRaceData) {
            Object.assign(this.settings, val.pointsRaceData)
          }
        }
        if (val.activatePointsRaceData) {
          this.activateSettings()
        }
        this.$store.commit('resetPointsRaceDataToWrite', null)
      },
      deep: true
    }

  },

  methods: {
    activateSettings () {
      this.$store.commit('setDisplayControlPointsRace', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.displayControl.pointsRace)
      this.isDirty = false
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.displayControl.pointsRace)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
