import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

function calcTotalTimeInSeconds (totalTime) {
  var parts = totalTime.split(':')
  parts = parts.reverse()
  var elapsedSeconds = 0.0
  if (0 in parts) {
    elapsedSeconds += parseFloat(parts[0])
  }
  if (1 in parts) {
    elapsedSeconds += parseInt(parts[1]) * 60
  }
  if (2 in parts) {
    elapsedSeconds += parseInt(parts[2]) * 3600
  }
  return elapsedSeconds
}

export default new Vuex.Store({
  state: {
    currentRace: {
      raceID: null,
      raceName: '',
      competitors: [],
      laptimes: []
    },
    displayControl: {
      timeRace: {
        show: true,
        showRefSpeed: false,
        refSpeed: 0,
        showRaceName: true,
        showLapTimes: true,
        numLapTimes: 5,
        showRaceTime: true,
        showLaps: true,
        showSpeed: true,
        styleWhiteBG: false,
        showResults: false,
        resultsSortedByBestTime: false,
        pauseRaceUpdate: false
      },
      countdown: {
        show: true,
        targetTime: new Date().toISOString().split('T')[0] + ' 23:59',
        showLabel: true,
        showSubText: false,
        subText: ''
      },
      ticker: {
        show: true,
        line1: '',
        line2: '',
        styleWhiteBG: false,
        laufschrift: false
      }
    },
    settings: {
      // urlRaceService: '/Race_times_example.json',
      urlRaceService: 'http://localhost:8090/race',
      lapDistance: 0.2,
      // numLapTimes: 5,
      // updateInterval: 1000
      updateInterval: 5000
    }
  },
  mutations: {
    setRace (state, newRace) {
      // Update Race and calclulate all Values
      console.log('Setting the race to ' + newRace.raceName + ' (' + newRace.elapsedTime + ')')
      // store laptimes
      var laptimes = state.currentRace.laptimes

      // if raceID has changed we reset the laptimes
      if (state.currentRace.raceID !== newRace.raceID) {
        laptimes = []
      }

      state.currentRace = newRace

      // Calculate elapsed Time in seconds
      var parts = newRace.elapsedTime.split(':')
      parts = parts.reverse()
      var elapsedSeconds = 0
      if (0 in parts) {
        elapsedSeconds += parseInt(parts[0])
      }
      if (1 in parts) {
        elapsedSeconds += parseInt(parts[1]) * 60
      }
      if (2 in parts) {
        elapsedSeconds += parseInt(parts[2]) * 3600
      }
      state.currentRace.elapsedSeconds = elapsedSeconds

      // Calculate startTime of Race
      parts = newRace.timeOfDay.split(':')
      var dateTimeOfDay = new Date()
      dateTimeOfDay.setHours(parts[0])
      dateTimeOfDay.setMinutes(parts[1])
      dateTimeOfDay.setSeconds(parts[2])
      dateTimeOfDay.setMilliseconds(0)

      state.currentRace.startTime = new Date(dateTimeOfDay.getTime() - (state.currentRace.elapsedSeconds * 1000))

      // Sort the Competitors
      state.currentRace.competitors.sort((a, b) => (a.position > b.position) ? 1 : -1)

      var firstCompetitor = state.currentRace.competitors[0]
      // First Laptime not before 10 seconds
      if (elapsedSeconds > 10 &&
          firstCompetitor !== undefined &&
          firstCompetitor.lapsComplete > 0) {
        // store laptime of leading Athlete
        laptimes[firstCompetitor.lapsComplete] = {
          lap: firstCompetitor.lapsComplete,
          time: calcTotalTimeInSeconds(firstCompetitor.lastLap)
        }
      }
      state.currentRace.laptimes = laptimes
    },

    setSettings (state, newSettings) {
      Object.assign(state.settings, newSettings)
    },

    setDisplayControlTimeRace (state, newTimeraceDisplayControl) {
      Object.assign(state.displayControl.timeRace, newTimeraceDisplayControl)
    },

    setDisplayControlCountdown (state, newCountdownDisplayControl) {
      Object.assign(state.displayControl.countdown, newCountdownDisplayControl)
    },

    setDisplayControlTicker (state, newTickerDisplayControl) {
      Object.assign(state.displayControl.ticker, newTickerDisplayControl)
    },

    xxxupdateUrlRaceservice (state, newValue) {
      state.settings.urlRaceService = newValue
    },

    loadStoreFromStorage (state) {
      // Writing of data from localStorage is implemented in main.js as a listener to the store
      // Check if the ID exists
      if (localStorage.getItem('store.settings')) {
        // Replace the state object with the stored item
        Object.assign(state.settings, JSON.parse(localStorage.getItem('store.settings')))
      }

      if (localStorage.getItem('store.displayControl.timeRace')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.timeRace, JSON.parse(localStorage.getItem('store.displayControl.timeRace')))
      }
      if (localStorage.getItem('store.displayControl.countdown')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.countdown, JSON.parse(localStorage.getItem('store.displayControl.countdown')))
      }
      if (localStorage.getItem('store.displayControl.ticker')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.ticker, JSON.parse(localStorage.getItem('store.displayControl.ticker')))
      }
    }
  },
  actions: {
    updateRace (context) {
      if (this.state.displayControl.timeRace.pauseRaceUpdate) {
        console.log('Race update is paused')
        return
      }
      //      Axios.get('https:/trapp/api/users.json', { withCredentials: true })
      Axios.get(this.state.settings.urlRaceService)
        .then(response => (context.commit('setRace', response.data)))
        .catch(error => {
          console.log(error)
          // we can't seem to catch the 302 status code as an error,
          // however, since it redirects to another domain (login.microsoftonline.com) it causes
          // a CORS error which makes error.response be undefined here.  This assumes that any time
          // error.response is undefined that we need to redirect to the login page
          if (typeof error.response === 'undefined') {
            console.log('looks like redirect from call')
          }
          this.errored = true
        })
    }
  },
  modules: {
  }

})
