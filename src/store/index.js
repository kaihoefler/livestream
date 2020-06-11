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
        showRefSpeed: false,
        refSpeed: 0,
        showRaceName: true,
        showLapTimes: true,
        showRaceTime: true,
        showLaps: true,
        showSpeed: true
      }
    },
    settings: {
      // urlRaceService: '/Race_times_example.json',
      urlRaceService: 'http://localhost:8090/race',
      lapDistance: 0.2,
      numLapTimes: 5,
      // updateInterval: 1000
      updateInterval: 500
    }
  },
  mutations: {
    setRace (state, newRace) {
      console.log('Setting the race to ' + newRace.raceName + ' (' + newRace.elapsedTime + ')')
      var laptimes = state.currentRace.laptimes

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
    }
  },
  actions: {
    updateRace (context) {
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
