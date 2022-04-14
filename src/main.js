import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    // Load the previous state from the local storage of the browser into the store
    this.$store.commit('loadStoreFromStorage')
    // Idea:
    // The configuration UI and the visualization are running in different instances (separat browser windows)
    // The configuration UI is writing to the store which is then written to local storage
    //
    // We register a listener to the vuex store to catch changes to the store and write them to the localStorage
    this.$store.subscribe((mutation, state) => {
      var jsonString = ''
      // Only when a update has been done which contains data which is in localStorage
      if (mutation.type === 'setSettings') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.settings)
        localStorage.setItem('store.settings', jsonString)
      }
      if (mutation.type === 'setDisplayControlTimeRace') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.displayControl.timeRace)
        localStorage.setItem('store.displayControl.timeRace', jsonString)
      }
      if (mutation.type === 'setDisplayControlPointsRace') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.displayControl.pointsRace)
        localStorage.setItem('store.displayControl.pointsRace', jsonString)
      }
      if (mutation.type === 'setDisplayControlCountdown') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.displayControl.countdown)
        localStorage.setItem('store.displayControl.countdown', jsonString)
      }
      if (mutation.type === 'setDisplayControlTicker') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.displayControl.ticker)
        localStorage.setItem('store.displayControl.ticker', jsonString)
      }
      if (mutation.type === 'persistPresetList') {
        // Store the state object as a JSON string
        jsonString = JSON.stringify(state.presets.presetList)
        console.log('save preset list to store:' + jsonString)
        localStorage.setItem('store.presets.presetList', jsonString)
      }
    })
  }
}).$mount('#app')
