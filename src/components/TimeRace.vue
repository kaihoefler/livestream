<template>
  <div class="hello">
    <div id="raceName" v-if="displayControl.showRaceName" >{{currentRace.raceName}}</div>
    <div id="zeit" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showRaceTime" >{{currentRace.elapsedTime}}</div>
    <div id="laps" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLaps" >Lap {{currentRace.lapsComplete}}</div>
    <div id="speed" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showSpeed" >Avg. Speed {{speed.text}}
      <span v-if="displayControl.showRefSpeed" v-bind:class="[(speed.value - displayControl.refSpeed) < 0 ? 'negativDelta' : 'positivDelta']">( {{ (speed.value - displayControl.refSpeed).toFixed(3)}} )</span></div>

    <div v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLapTimes" id="laptimes">
      <table >
        <tr><td width=60>Lap</td><td width=100>Time</td><td width=100>Speed</td></tr>
        <tr v-for="laptime in laptimes" :key="laptime.lap">
          <td>{{ laptime.lap.toString() }}</td>
          <td>{{ laptime.time.toFixed(2) }}</td>
          <td>{{ (lapDist/laptime.time * 3600).toFixed(2) }}</td>
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
      var numLapTimes = this.$store.state.settings.numLapTimes
      var laptimes = this.$store.state.currentRace.laptimes.slice(-1 * numLapTimes).sort((a, b) => (a.lap < b.lap) ? 1 : -1)
      return laptimes.filter((element) => {
        return element !== undefined
      })
    },

    lapDist () {
      return this.$store.state.settings.lapDistance
    }

  },
  data: function () {
    return {
      showRaceName: true,
      showLapTimes: true,
      showRaceTime: true,
      showLaps: true,
      showSpeed: true,
      showRefSpeed: false

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#raceName
{
  position:absolute;
  top:50px;
  left:0px;
  width:750px;
  height:50px;
  font-size:40px;
  font-style:italic;
  text-align:right;
  /* box-shadow: 0 8px 2px -2px #ff0000; */
  border-bottom: thick solid #e30614;
 /* Farbschema blau mit Hintergrund
  color:0078b3;
  background-color: rgba(255, 255, 255, 0.9);
*/

/* Farbschema weis ohne Hintergrund */

}

#zeit
{
  position:absolute;
  top:925px;
  left:1550px;
  height:50px;
  width:200px;
  text-align:Center;

  font-size:40px;
/* Farbschema blau mit Hintergrund
  background-color: rgba(255, 255, 255, .9);
  border-radius: 40px;
  border: 4px solid #0078b3;
  background-color: rgba(255, 255, 255, .9);
  color:0078b3;
*/
  /* Farbschema weis ohne Hintergrund */
  color:#fff;
}

#laps
{
  position:absolute;
  top:925px;
  left:1290px;
  /* color:0078b3; */
  height:50px;
  width:250px;
  text-align:Center;

  font-size:40px;
 /* Farbschema blau mit Hintergrund
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  border: 4px solid #0078b3;
  background-color: rgba(255, 255, 255, .9);
*/

}

#laptimes
{
  position:absolute;
  top:300px;
  left:50px;
  width:300px;
  height:250px;
  /* color: #0078b3; */

  font-size:40px;
/* Farbschema blau mit Hintergrund
  border-radius: 20px;
  border: 4px solid #0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-align:Center;
 */
  padding-left:10px;
  padding-top:10px;
}

#laptimes table
{
  /* color: #0078b3; */
  font-size:30px;
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;

}

#speed
{
  position:absolute;
  top:925px;
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

/* Farbschema blau mit Hintergrund
#speed .positivDelta
{
  color:#0078b3;
}
*/

#speed .negativDelta
{
  color:#e30614;
  text-shadow: none;
}

</style>
