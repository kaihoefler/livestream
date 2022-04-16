<template>
  <div>
    <div class="card is-info">
      <header class="card-header notification is-success">
        <p class="card-header-title">
          Presets
        </p>
      </header>
      <div class="card-content">
        <div id="presets" >
          <div class="box">
            <div class="field">
              <label class="label">Preset Name</label>
              <input v-model="presets.currentPreset.name" class="input" type="text" placeholder="Name of the preset">
            </div>
            <div><label class="checkbox">
              <input v-model="presets.currentPreset.hasTimeRaceSettings" type="checkbox">
              Use Time Race Settings
            </label></div>
            <div><label class="checkbox">
              <input v-model="presets.currentPreset.hasPointsRaceSettings" type="checkbox">
              Use Point Race Settings
            </label></div>
            <div><label class="checkbox">
              <input :disabled=true v-model="presets.currentPreset.hasTickerSettings" type="checkbox">
              Use Ticker Settings
            </label></div>
            <button v-on:click="savePreset(false)" :disabled=!isDirty class="button is-primary">Save Preset</button>&nbsp;
            <button v-on:click="savePreset(true)" :disabled=!isDirty class="button is-primary">Save Preset as New</button>&nbsp;
            <button v-on:click="resetForm" :disabled=!isDirty class="button is-secondary">Clear</button>
          </div>
          <table class="table">
            <tr>
              <th>Name</th>
              <th><abbr title="Preset has Time Race Settings">Time</abbr></th>
              <th><abbr title="Preset has Points Race Settings">Points</abbr></th>
              <th><abbr title="Preset has Ticker Settings">Ticker</abbr></th>
              <th>Action</th>
            </tr>
            <tr v-for="(preset, index) in presetList" :key="preset.name" >
              <td style="text-align:left">{{ preset.name }}</td>
              <td style="text-align:center"><input v-model="preset.hasTimeRaceSettings" type="checkbox" disabled></td>
              <td style="text-align:center"><input v-model="preset.hasPointsRaceSettings" type="checkbox" disabled></td>
              <td style="text-align:center"><input v-model="preset.hasTickerSettings" type="checkbox" disabled></td>
              <td style="text-align:left"><button v-on:click="editPreset(index)" class="button is-small is-primary">Edit</button>&nbsp;
                                          <button v-on:click="activatePreset(index)" class="button is-small is-primary">Activate</button>&nbsp;
                                          <button v-on:click="deletePreset(index)" class="button is-small is-warning">Delete</button></td>
            </tr>
          </table>
        </div>
      </div>
      <footer class="card-footer">
        <div class="field is-grouped">
          <button v-on:click="showPresets" class="button is-primary">Export Preset Data</button>&nbsp;
          <button v-on:click="showImportPresets" class="button is-primary">Import Preset Data</button>&nbsp;
          <button v-on:click="cleanLocalStore" class="button is-danger is-small">Clean local Storage</button>
        </div>
      </footer>
    </div>
    <div class="modal" v-bind:class="{ 'is-active': showPresetData }">
        <div class="modal-background"></div>
         <div class="modal-content">
          <article class="message is-link">
          <div class="message-header">
              <p>Copy and save the following json document</p>
              <button  v-on:click="hidePresets" class="delete" aria-label="delete"></button>
            </div>
            <div class="message-body">
              <pre>{{ jsonStoredPresets }}</pre>
            </div>
            </article>
        </div>
        <button  v-on:click="hidePresets"  class="modal-close is-large" aria-label="close"></button>
    </div>
    <div class="modal" v-bind:class="{ 'is-active': showPresetImport }">
        <div class="modal-background"></div>
         <div class="modal-content">
          <article class="message is-link">
            <div class="message-header">
              <p>Paste the json document</p>
              <button  v-on:click="hidePresets" class="delete" aria-label="delete"></button>
            </div>
            <div class="message-body">
              <div class="field">
              <label class="label">Preset Data</label>
                <input v-model="presetImportData" class="input" type="textarea" rows="7" placeholder="please paste the configuration here">
              </div>
              <button v-on:click="presetJsonImport" class="button is-small is-primary">Import</button>&nbsp;
            </div>
            </article>
        </div>
        <button  v-on:click="hidePresets"  class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Presets',
  props: {
    msg: String,
    activePreset: Number
  },
  computed: {
    // use read only -> Values come from the store
    storedPresets () {
      return this.$store.state.presets
    },
    jsonStoredPresets () {
      return JSON.stringify(this.$store.state.presets.presetList)
    },
    // for each updateable attribute from the store we need to create getters and setters
    presetList: {
      get () {
        return this.$store.state.presets.presetList
      },
      set (value) {
        this.$store.commit('setPresetList', value)
      }
    }

  },

  data: function () {
    return {
      presets: {
        currentPreset: {
          name: '',
          hasTimeRaceSettings: false,
          hasPointsRaceSettings: false,
          hasTickerSettings: false,
          timeRaceSettings: {
            show: true,
            showRefSpeed: false,
            refSpeed: 0,
            showRaceName: true,
            showLapTimes: false,
            showBestLapTimes: false,
            numLapTimes: 5,
            showRaceTime: true,
            showLaps: true,
            showSpeed: true,
            styleWhiteBG: {
              raceName: false,
              laps: false,
              results: false
            },
            showStartlist: false,
            showResults: false,
            resultsSortedByBestTime: false,
            pauseRaceUpdate: false
          },
          pointRaceSettings: {
            showPoints: true,
            showElims: true,
            styleWhiteBG: false,
            numElimsToShow: 15,
            showResults: false,
            pausePointsUpdate: false
          },
          tickerSettings: {
            show: true,
            line1: '',
            line2: '',
            styleWhiteBG: false,
            laufschrift: false
          }

        },
        selectedPreset: -1,
        presetList: []
      },
      showPresetData: false,
      showPresetImport: false,
      presetImportData: '',
      isDirty: false
    }
  },

  watch: {
    'presets.currentPreset': {
      handler (val, oldVal) {
        if (val.name === '') {
          this.isDirty = false
        } else {
          this.isDirty = true
        }
      },
      deep: true
    }
  },

  methods: {

    savePreset (asNew) {
      // we fill the requested Presets with data
      if (this.presets.currentPreset.hasTimeRaceSettings) {
        this.presets.currentPreset.timeRaceSettings = Object.assign({}, this.$store.state.displayControl.timeRaceFormData)
      }
      if (this.presets.currentPreset.hasPointsRaceSettings) {
        this.presets.currentPreset.pointsRaceSettings = Object.assign({}, this.$store.state.displayControl.pointsRaceFormData)
      }
      const clonedPreset = Object.assign({}, this.presets.currentPreset)
      if (this.presets.selectedPreset >= 0 && asNew === false) {
        this.presetList[this.presets.selectedPreset] = clonedPreset
      } else {
        this.presetList.push(clonedPreset)
      }
      this.presetList.sort(function (a, b) {
        var nameA = a.name.toUpperCase() // Groß-/Kleinschreibung ignorieren
        var nameB = b.name.toUpperCase() // Groß-/Kleinschreibung ignorieren
        if (nameA < nameB) { return -1 }
        if (nameA > nameB) { return 1 }
        // Namen müssen gleich sein
        return 0
      })
      this.resetForm()
      this.$store.commit('persistPresetList')
    },

    resetForm () {
      this.presets.selectedPreset = -1
      this.presets.currentPreset.name = ''
      this.presets.currentPreset.hasTimeRaceSettings = false
      this.presets.currentPreset.timeRaceSettings = null
      this.presets.currentPreset.hasPointsRaceSettings = false
      this.presets.currentPreset.hasTickerSettings = false
      this.isDirty = false
    },

    editPreset (index) {
      const presetToLoad = this.presetList[index]
      this.presets.currentPreset = Object.assign({}, presetToLoad)
      this.presets.selectedPreset = index
      if (presetToLoad.hasTimeRaceSettings) {
        this.$store.commit('setTimeRaceDataToWrite', { activateTimeRaceData: false, loadTimeRaceData: true, timeRaceData: Object.assign({}, presetToLoad.timeRaceSettings) })
      }
      if (presetToLoad.hasPointsRaceSettings) {
        this.$store.commit('setPointsRaceDataToWrite', { activatePointsRaceData: false, loadPointsRaceData: true, pointsRaceData: Object.assign({}, presetToLoad.pointsRaceSettings) })
      }
      this.isDirty = true
    },

    deletePreset (index) {
      this.presetList = this.presetList.splice(index, 1)
      this.$store.commit('persistPresetList')
    },

    activatePreset (index) {
      // const presetToActivate = this.presetList[index]
      // todo Activate
      const presetToAtvivate = this.presetList[index]
      if (presetToAtvivate.hasTimeRaceSettings) {
        this.$store.commit('setTimeRaceDataToWrite', { activateTimeRaceData: true, loadTimeRaceData: false, timeRaceData: Object.assign({}, presetToAtvivate.timeRaceSettings) })
      }
      if (presetToAtvivate.hasPointsRaceSettings) {
        this.$store.commit('setPointsRaceDataToWrite', { activatePointsRaceData: true, loadPointsRaceData: false, pointsRaceData: Object.assign({}, presetToAtvivate.pointsRaceSettings) })
      }
    },
    showImportPresets () {
      this.showPresetImport = true
    },
    showPresets () {
      this.showPresetData = true
    },
    hidePresets () {
      this.showPresetData = false
      this.showPresetImport = false
    },
    presetJsonImport () {
      // Todo sanitize data and imports
      this.showPresetImport = false
      var importedObject = JSON.parse(this.presetImportData)
      // console.log(typeof importedObject + ' is Array? ' + Array.isArray(importedObject))
      // console.log(JSON.stringify(importedObject, null, 4))
      if (importedObject && Array.isArray(importedObject)) {
        console.log('Will update preset List')
        this.presetList = importedObject
      }
    },
    cleanLocalStore () {
      localStorage.removeItem('store.displayControl.ticker')
      localStorage.removeItem('store.displayControl.countdown')
      localStorage.removeItem('store.displayControl.pointsRace')
      localStorage.removeItem('store.displayControl.timeRace')
      localStorage.removeItem('store.settings')
      localStorage.removeItem('store.presets.presetList')
    }

  },

  beforeMount () {
    Object.assign(this.presets, this.$store.state.presets)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
