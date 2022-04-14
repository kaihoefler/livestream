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

// todo: Split into Modules:
// 1. Controller
// 2. Visulisation
// 3. Presets

export default new Vuex.Store({
  state: {
    currentRace: {
      raceID: null,
      raceName: '',
      flagStatus: '',
      competitors: [],
      laptimes: [],
      startlist: []
    },
    currentPointsRace: {
      ID: null,
      Name: '',
      Type: '',
      isPoints: false,
      isElimination: false,
      PointResults: [],
      Eliminations: [],
      FinishOrder: [],
      EliminationResults: []
    },
    displayControl: {
      // Activated Time Race Content
      timeRace: {
        show: true,
        showRefSpeed: false,
        refSpeed: 0,
        showRaceName: true,
        showLapTimes: true,
        showBestLapTimes: false,
        numLapTimes: 5,
        showRaceTime: true,
        showLaps: true,
        showSpeed: true,
        styleWhiteBG: false,
        showStartlist: false,
        showResults: false,
        resultsSortedByBestTime: false,
        pauseRaceUpdate: false
      },
      timeRaceFormData: {
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
      pointsRace: {
        showPoints: true,
        showElims: true,
        styleWhiteBG: false,
        numElimsToShow: 15,
        showResults: false,
        pausePointsUpdate: false
      },
      pointsRaceFormData: {
        // only placeholder value
        show: true
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
      },
      tickerFormData: {
        // only placeholder value
        show: true
      }
    },
    settings: {
      // urlRaceService: '/Race_times_example.json',
      urlRaceService: 'http://localhost:8090/race',
      urlPointsService: 'http://localhost/punkterennen/race_status.php',
      pausePointsRaceUpdate: false,
      lapDistance: 0.2,
      // numLapTimes: 5,
      // updateInterval: 1000
      updateInterval: 5000,
      updateIntervalPoints: 5000
    },
    presets: {
      presetList: [],
      selectedPreset: -1,
      dataToWriteToTimeRaceController: {
        loadTimeRaceData: false,
        activateTimeRaceData: false,
        timeRaceData: {}
      },
      dataToWriteToPointsRaceController: {
        loadPointsRaceData: false,
        activatePointsRaceData: false,
        pointsRaceData: {}
      },
      dataToWriteToTickerController: {
        loadTickereData: false,
        activateTickerData: false,
        tickerData: {}
      }

    }
  },
  mutations: {

    // module Visulization

    setRace (state, newRace) {
      // Update Race and calclulate all Values
      console.log('Setting the race to ' + newRace.raceName + ' (' + newRace.elapsedTime + ')')
      // store laptimes
      var laptimes = state.currentRace.laptimes
      var startlist = state.currentRace.startlist
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

      // if we have "PURPLE" flag we store the competitors List in the Startlist
      if (newRace.flagStatus === 'PURPLE') {
        startlist = []
        state.currentRace.competitors.forEach(element => {
          startlist.push(Object.assign({}, element))
        })
      }
      state.currentRace.startlist = startlist
    },

    setPointsRace (state, newPointsRace) {
      // Update Race and calclulate all Values
      console.log('Setting the race to ' + newPointsRace.Name)
      // store values
      state.currentPointsRace = newPointsRace
      state.currentPointsRace.Name = newPointsRace.Race.Name
      state.currentPointsRace.ID = newPointsRace.Race.ID
      state.currentPointsRace.Type = newPointsRace.Race.Type
      state.currentPointsRace.isPoints = (String(newPointsRace.Race.Type).search('Points') >= 0)
      state.currentPointsRace.isElimination = (String(newPointsRace.Race.Type).search('Elimination') >= 0)
      // Wenn die Anzeige von PointsRace aktiviert ist und es kein TimeRace gibt (RaceID = null) dann verwenden wir diesen Renn-Namen
      if (state.displayControl.pointsRace.show === true && state.currentRace.raceID === null) {
        state.currentRace.raceName = newPointsRace.Race.Name
      }
    },

    // module Controller

    setSettings (state, newSettings) {
      Object.assign(state.settings, newSettings)
    },

    setDisplayControlTimeRace (state, newTimeraceDisplayControl) {
      Object.assign(state.displayControl.timeRace, newTimeraceDisplayControl)
    },
    setDisplayControlTimeRaceFormData (state, newTimeraceDisplayControl) {
      Object.assign(state.displayControl.timeRaceFormData, newTimeraceDisplayControl)
    },

    setDisplayControlPointsRace (state, newPointsraceDisplayControl) {
      Object.assign(state.displayControl.pointsRace, newPointsraceDisplayControl)
    },
    setDisplayControlPointsRaceFormData (state, newPointsraceDisplayControl) {
      Object.assign(state.displayControl.pointsRaceFormData, newPointsraceDisplayControl)
    },

    setDisplayControlCountdown (state, newCountdownDisplayControl) {
      Object.assign(state.displayControl.countdown, newCountdownDisplayControl)
    },

    setDisplayControlTicker (state, newTickerDisplayControl) {
      Object.assign(state.displayControl.ticker, newTickerDisplayControl)
    },
    setDisplayControlTickerFormData (state, newTickerDisplayControl) {
      Object.assign(state.displayControl.ticker, newTickerDisplayControl)
    },

    xxxupdateUrlRaceservice (state, newValue) {
      state.settings.urlRaceService = newValue
    },

    loadStoreFromStorage (state) {
      // we load all data from localStorage (of the browser)
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
      if (localStorage.getItem('store.displayControl.pointsRace')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.pointsRace, JSON.parse(localStorage.getItem('store.displayControl.pointsRace')))
      }
      if (localStorage.getItem('store.displayControl.countdown')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.countdown, JSON.parse(localStorage.getItem('store.displayControl.countdown')))
      }
      if (localStorage.getItem('store.displayControl.ticker')) {
        // Replace the state object with the stored item
        Object.assign(state.displayControl.ticker, JSON.parse(localStorage.getItem('store.displayControl.ticker')))
      }
      if (localStorage.getItem('store.presets.presetList')) {
        // Replace the state object with the stored item
        state.presets.presetList = JSON.parse(localStorage.getItem('store.presets.presetList'))
      }
    },

    // module Presets
    setPresetList (state, newList) {
      state.presets.presetList = newList
    },

    persistPresetList (state) {
      // nothing to do. This will trigger save to local store
    },

    resetTimeRaceDataToWrite (state) {
      state.presets.dataToWriteToTimeRaceController.activateTimeRaceData = false
      state.presets.dataToWriteToTimeRaceController.loadTimeRaceData = false
      state.presets.dataToWriteToTimeRaceController.timeRaceData = null
      // console.log('resetTimeRaceDataToWrite')
    },

    setTimeRaceDataToWrite (state, newValue) {
      state.presets.dataToWriteToTimeRaceController.timeRaceData = Object.assign({}, newValue.timeRaceData)
      state.presets.dataToWriteToTimeRaceController.activateTimeRaceData = newValue.activateTimeRaceData
      state.presets.dataToWriteToTimeRaceController.loadTimeRaceData = newValue.loadTimeRaceData
    },

    resetPointsRaceDataToWrite (state) {
      state.presets.dataToWriteToPointsRaceController.activatePointsRaceData = false
      state.presets.dataToWriteToPointsRaceController.loadPointsRaceData = false
      state.presets.dataToWriteToPointsRaceController.pointsRaceData = null
      // console.log('resetTimeRaceDataToWrite')
    },

    setPointsRaceDataToWrite (state, newValue) {
      state.presets.dataToWriteToPointsRaceController.pointsRaceData = Object.assign({}, newValue.pointsRaceData)
      state.presets.dataToWriteToPointsRaceController.activatePointsRaceData = newValue.activatePointsRaceData
      state.presets.dataToWriteToPointsRaceController.loadPointsRaceData = newValue.loadPointsRaceData
    }

  },
  actions: {

    // module Visualization
    updateRace (context) {
      if (this.state.displayControl.timeRace.pauseRaceUpdate) {
        console.log('Race update is paused')
        return
      }
      //      Axios.get('https:/trapp/api/users.json', { withCredentials: true })
      // Get the race result from Leaderboard Race Service
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
      if (!this.state.settings.pausePointsRaceUpdate) {
        // Get the race result from Punkterennen Service
        Axios.get(this.state.settings.urlPointsService)
          .then(response => (context.commit('setPointsRace', response.data)))
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
    }
  },
  modules: {
  }

})
