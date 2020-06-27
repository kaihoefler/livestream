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
    // Load the data from the storage into the store
    this.$store.commit('loadStoreFromStorage')
    // We register a listener to the store to catch changes to the store and write them to the localStorage
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
    })
  }
}).$mount('#app')
