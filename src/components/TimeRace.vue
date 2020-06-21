<template>
  <div class="hello">
    <div id="raceName" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="displayControl.showRaceName" >{{currentRace.raceName}} &nbsp;</div>
    <div id="zeit" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showRaceTime" >{{currentRace.elapsedTime}}</div>
    <div id="laps" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLaps" >Lap {{currentRace.lapsComplete}}</div>
    <div id="speed" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showSpeed" >Avg. Speed {{speed.text}}
      <span v-if="displayControl.showRefSpeed" v-bind:class="[(speed.value - displayControl.refSpeed) < 0 ? 'negativDelta' : 'positivDelta']">( {{ (speed.value - displayControl.refSpeed).toFixed(3)}} )</span></div>

    <div id="laptimes" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentRace.flagStatus == 'GREEN' && displayControl.showLapTimes">
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
      var numLapTimes = this.$store.state.displayControl.timeRace.numLapTimes
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
  border-bottom: thick solid #e30614;
  padding-right:10px;

}

#raceName.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
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
}

#zeit.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
}
#laps
{
  position:absolute;
  top:925px;
  left:1290px;
  height:50px;
  width:250px;
  text-align:Center;
  font-size:40px;
}

#laps.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
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
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
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

/* Farbschema blau mit Hintergrund weiß */
#speed.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 40px;
  border: 4px solid #0078b3;
}

#speed .negativDelta
{
  color:#e30614;
  text-shadow: none;
}

</style>
