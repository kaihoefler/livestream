<template>
  <div v-if="displayControl.show" class="hello">
    <div id="raceName" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="displayControl.showRaceName" >{{currentRace.raceName}} &nbsp;</div>
    <div id="zeit" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showRaceTime" >{{currentRace.elapsedTime}}</div>
    <div id="laps" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLaps" >Lap {{currentRace.lapsComplete}}</div>
    <div id="speed" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showSpeed" >Avg. Speed {{speed.text}}
      <span v-if="displayControl.showRefSpeed" v-bind:class="[(speed.value - displayControl.refSpeed) < 0 ? 'negativDelta' : 'positivDelta']">( {{ (speed.value - displayControl.refSpeed).toFixed(3)}} )</span></div>

    <div id="laptimes" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLapTimes">
      <table >
        <tr><td width=60>Lap</td><td width=100>Time</td><td width=100>Speed</td></tr>
        <tr v-for="laptime in laptimes" :key="laptime.lap" >
          <td>{{ laptime.lap.toString() }}</td>
          <td>{{ laptime.time.toFixed(2) }}</td>
          <td>{{ (lapDist/laptime.time * 3600).toFixed(2) }}</td>
        </tr>
      </table>
    </div>

    <div id="bestlaps" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="(currentRace.flagStatus == 'GREEN' ) && displayControl.showBestLapTimes">
      <table >
        <tr><td width=40>Place</td><td width=180>Name</td><td width=80>Time</td></tr>
        <tr v-for="result in bestLapResult" :key="result.number" >
          <td :class="{ redtext: result.hasMaxTotalTime}">{{ result.position.toString() }}</td>
          <td :class="{ redtext: result.hasMaxTotalTime}">{{ result.firstName.slice(0,1) }}. {{ result.lastName }}</td>
          <td :class="{ redtext: result.hasMaxTotalTime}">{{ result.result }}</td>
        </tr>
      </table>
    </div>

    <div id="results" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'FINISH' && displayControl.showResults">
      <table >
        <tr><th colspan=2 style="text-align: center">Results</th></tr>
        <tr><td width=100>Place</td><td width=600>Name</td><td width=100>Time</td></tr>
        <tr v-for="result in  pagedResult" :key="result.number" >
          <td>{{ result.position.toString() }}</td>
          <td>{{ result.firstName }} {{ result.lastName }}</td>
          <td>{{ result.result }}</td>
        </tr>
      </table>
    </div>

    <div id="startlist" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'PURPLE' && displayControl.showStartlist">
      <table >
        <tr><th colspan=2 style="text-align: center">Startlist</th></tr>
        <tr><td width=100>No.</td><td width=600>Name</td></tr>
        <tr v-for="result in  pagedStartlist" :key="result.number" >
          <td>{{ result.number.toString() }}</td>
          <td>{{ result.firstName }} {{ result.lastName }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

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

export default {
  name: 'TimeRace',
  props: {
    msg: String
  },

  computed: {
    currentRace () {
      return this.$store.state.currentRace
    },

    displayControl () {
      return this.$store.state.displayControl.timeRace
    },

    speed () {
      var currentRace = this.$store.state.currentRace
      var leadingCompetitor = currentRace.competitors[0]
      if (leadingCompetitor.lapsComplete === undefined) {
        return null
      }
      var totalTime = calcTotalTimeInSeconds(leadingCompetitor.totalTime)
      // calculate Speed
      var speed = {
        value: 0,
        text: ' - '
      }

      if (totalTime > 0) {
        speed.value = (leadingCompetitor.lapsComplete * this.$store.state.settings.lapDistance / totalTime) * 3600
        speed.text = speed.value.toFixed(3)
      }
      return speed
    },

    laptimes () {
      var numLapTimes = this.$store.state.displayControl.timeRace.numLapTimes
      var laptimes = this.$store.state.currentRace.laptimes.slice(-1 * numLapTimes).sort((a, b) => (a.lap < b.lap) ? 1 : -1)
      return laptimes.filter((element) => {
        return element !== undefined && element.time > 0
      })
    },

    results () {
      // copy and filter
      var competitors = this.$store.state.currentRace.competitors.slice().filter((element) => {
        return element !== undefined && element.lapsComplete > 0
      })
      competitors.sort((a, b) => (a.position > b.position) ? 1 : -1)
      // should we sort by Best Time?
      if (this.$store.state.displayControl.timeRace.resultsSortedByBestTime) {
        competitors.sort((a, b) => (a.bestLap > b.bestLap) ? 1 : -1)
        var currentPosition = 0
        var lastBestTime = -1
        var counter = 0
        var maxTotalTime = -1
        var startnumberOfMaxTotalTime = -1
        competitors.forEach(element => {
          var bestLap = calcTotalTimeInSeconds(element.bestLap)
          if (maxTotalTime < calcTotalTimeInSeconds(element.totalTime)) {
            maxTotalTime = calcTotalTimeInSeconds(element.totalTime)
            startnumberOfMaxTotalTime = element.number
          }
          if (lastBestTime < bestLap) {
            currentPosition = counter + 1
          }
          element.position = currentPosition
          counter += 1
          lastBestTime = bestLap
          element.result = bestLap.toFixed(3)
        })
        if (startnumberOfMaxTotalTime > 0) {
          var competitor = competitors.find((element) => (element.number === startnumberOfMaxTotalTime))
          if (competitor) { competitor.hasMaxTotalTime = true }
        }
      } else {
        competitors.forEach(element => {
          if (element !== undefined) {
            element.result = element.totalTime
          }
        })
      }
      return competitors
    },

    lapDist () {
      return this.$store.state.settings.lapDistance
    },

    pagedResult () {
      var rowsToShow = this.displayControl.numLapTimes
      var results = this.results
      var pages = Math.ceil(results.length / rowsToShow)
      var currentPage = Math.trunc(((this.now - this.pagingStartTime) / 10) % pages)
      // console.log('result.length:' + results.length + 'pages:' + pages + ' currentPage: ' + currentPage)
      return results.slice(currentPage * rowsToShow, (currentPage + 1) * rowsToShow)
    },

    pagedStartlist () {
      var rowsToShow = this.displayControl.numLapTimes
      var startlist = this.$store.state.currentRace.startlist.slice().filter((element) => {
        return element !== undefined
      })
      startlist.sort((a, b) => (a.position > b.position) ? 1 : -1)
      var pages = Math.ceil(startlist.length / rowsToShow)
      var currentPage = Math.trunc(((this.now - this.pagingStartTime) / 10) % pages)
      // console.log('result.length:' + results.length + 'pages:' + pages + ' currentPage: ' + currentPage)
      return startlist.slice(currentPage * rowsToShow, (currentPage + 1) * rowsToShow)
    },

    bestLapResult () {
      var rowsToShow = parseInt(this.displayControl.numLapTimes)
      var results = this.results
      var index = results.findIndex((element) => (element.hasMaxTotalTime === true))
      var startindex = 0
      if (index >= 0) {
        startindex = Math.trunc(Math.max(0, index - (rowsToShow / 2)))
      }
      // console.log('endindex:' + (startindex + rowsToShow) + ' startindex:' + startindex)
      return results.slice(startindex, startindex + rowsToShow)
    }

  },
  data: function () {
    return {
      showRaceName: true,
      showLapTimes: false,
      showBestLapTimes: false,
      showRaceTime: true,
      showLaps: true,
      showSpeed: true,
      showRefSpeed: false,

      // for paging of results
      now: Math.trunc(new Date().getTime() / 1000),
      pagingStartTime: Math.trunc(new Date().getTime() / 1000),
      // get an intervall every second (initialized in create)
      interval: null
    }
  },
  created () {
    this.interval = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
    console.log('TimeRace Created')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#raceName
{
  position:absolute;
  top:30px;
  left:0px;
  width:750px;
  height:50px;
  font-size:40px;
  font-style:italic;
  text-align:right;
  border-bottom: thick solid #e30614;
  padding-right:10px;

}

#raceName.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
}

#zeit
{
  position:absolute;
  bottom:40px;
  right:50px;
  width:200px;
  text-align:Center;

  font-size:40px;
}

#zeit.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
  padding-top:12px;
  padding-bottom:10px;
}

#laps
{
  position:absolute;
  bottom:40px;
  right:290px;
  width:180px;
  text-align:Center;
  font-size:40px;
}

#laps.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
  padding:10px;
}

#results,
#startlist
{
  position:absolute;
  top:160px;
  left:400px;
  /* width:800px; */
  text-align:left;
  font-size:40px;
  padding-left:10px;
  padding-top:10px;
}

#startlist,
#results.whiteBG
{
  color:#0078b3;
  background-color: rgb(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
  padding: 20px;
}

#startlist,
#results table
{
  font-size:30px;
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}

#startlist,
#results.whiteBG table
{
  color:#0078b3;
  text-shadow: none;
  line-height: 1;
}

#laptimes
{
  position:absolute;
  top:300px;
  left:50px;
  width:300px;
  height:250px;
  text-align:Center;
  font-size:40px;
  padding-left:10px;
  padding-top:10px;
}

#laptimes.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
}

#laptimes table
{
  font-size:30px;
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}
#laptimes.whiteBG table
{
  color:#0078b3;
  text-shadow: none;
}

#bestlaps
{
  position:absolute;
  top:180px;
  left:50px;
  text-align:left;
  font-size:20px;
  padding-left:10px;
  padding-top:10px;
}

#bestlaps.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
  padding: 15px;
}

#bestlaps table
{
  font-size:20px;
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}
#bestlaps.whiteBG table
{
  color:#0078b3;
  text-shadow: none;
}

.redtext
{
  color: red;
}

#speed
{
  position:absolute;
  bottom:40px;
  left:150px;
  width:550px;
  height:50px;

  font-size:40px;
/* Farbschema blau mit Hintergrund
  color:#0078b3;
  border-radius: 40px;
  border: 4px solid #0078b3;
  background-color: rgba(255, 255, 255, 0.9);
 */
  text-align:Center;
}

/* Farbschema blau mit Hintergrund weiß */
#speed.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
  line-height: 1;
}

#speed .negativDelta
{
  color:#e30614;
  text-shadow: none;
}

</style>
