<template>
  <div v-if="displayControl.show" class="hello">
    <div id="points" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentPointsRace.isPoints && displayControl.showPoints && points.length > 0">
      <table >
        <tr><td width=50>No.</td><td width=200>Name</td><td width=100>Points</td></tr>
        <tr v-for="point in points" :key="point.Place" >
          <td style="text-align:right">{{ point.Startnumber.toString() }}</td>
          <td style="text-align:left">{{ point.FirstName.toString().substring(0,1) }}. {{ point.LastName.toString() }}</td>
          <td>{{ point.Points.toString() }}</td>
        </tr>
      </table>
    </div>

    <div id="elims" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="currentPointsRace.isElimination && displayControl.showElims && elims.length > 0">
      <table >
        <tr><td colspan="2">Eliminations</td></tr>
        <!--<tr><td width=50>No.</td><td width=200>Name</td></tr>-->
        <tr v-for="elim in elims" :key="elim.Startnumber" >
          <td width=50 style="text-align:center">{{ elim.Startnumber.toString() }}</td>
          <td width=180 style="text-align:left">{{ elim.FirstName.toString().substring(0,1) }}. {{ elim.LastName.toString() }}</td>
        </tr>
      </table>
    </div>
<!-- Point Results -->
    <div id="results" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="displayControl.showResults && currentPointsRace.isPoints">
      <div style="text-align:center"> Results</div>
      <table >
        <tr><td width=100>Place</td><td width=700>Name</td><td width=100>Points</td></tr>
        <tr v-for="result in results" :key="result.Startnumber" >
          <td>{{ result.Place.toString() }}</td>
          <td>{{ result.FirstName }} {{ result.LastName }}</td>
          <td><div v-if="result.Points !== null && result.Points > 0">{{ result.Points }}</div></td>
        </tr>
      </table>
    </div>
    <div id="results" v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="displayControl.showResults && currentPointsRace.isElimination && !currentPointsRace.isPoints">
      <div style="text-align:center"> Results</div>
      <table >
        <tr><td width=100>Place</td><td width=700>Name</td><td width=100></td></tr>
        <tr v-for="result in results" :key="result.Startnumber" >
          <td>{{ result.Place.toString() }}</td>
          <td>{{ result.FirstName }} {{ result.LastName }}</td>
          <td><div class="elim" v-if="result.Eliminated > 0">(Elim.)</div></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PointsRace',
  props: {
    msg: String
  },

  computed: {
    currentPointsRace () {
      return this.$store.state.currentPointsRace
    },

    displayControl () {
      return this.$store.state.displayControl.pointsRace
    },

    points () {
      var PointResults = []
      if (this.$store.state.currentPointsRace.PointResults) PointResults = this.$store.state.currentPointsRace.PointResults.slice()
      return PointResults.slice(0, this.$store.state.displayControl.pointsRace.numElimsToShow + 1).filter((element) => {
        return element !== undefined && element.Points !== null && element.Points > 0
      })
    },

    elims () {
      var Eliminations = []
      if (this.$store.state.currentPointsRace.Eliminations) Eliminations = this.$store.state.currentPointsRace.Eliminations.slice()
      return Eliminations.slice(0, this.$store.state.displayControl.pointsRace.numElimsToShow + 1)
    },

    results () {
      // For Points Race:
      // Take Points and add Eliminations at the end
      // Result is taken from PointsResults field
      // Starters with no Finish
      // For pure Eliminations:
      // Take Finish Order and add Eliminations at the end
      if (this.$store.state.currentPointsRace.isPoints) {
        var localPointResults = []
        if (this.$store.state.currentPointsRace.PointResults) {
          localPointResults = this.$store.state.currentPointsRace.PointResults.slice()
          // Filter all Results with FinishOrder = 999 and not eliminated (Did not finish)
          localPointResults.filter((element) => {
            return element !== undefined && element.FinishOrder >= 999 && element.Eliminated === 0
          })
        }

        return localPointResults.slice(0, this.$store.state.displayControl.pointsRace.numElimsToShow)
      } else { // for elimination races we wait for the EliminationResults being available
        if (this.$store.state.currentPointsRace.isElimination) {
          var localElimResults = []
          if (this.$store.state.currentPointsRace.EliminationResults && this.$store.state.currentPointsRace.EliminationResults.length > 0) {
            localElimResults = this.$store.state.currentPointsRace.EliminationResults.slice()
          }
          return localElimResults.slice(0, this.$store.state.displayControl.pointsRace.numElimsToShow)
        } else {
          return []
        }
      }
    }

  },
  data: function () {
    return {
      showPoints: true,
      showElims: true,
      styleWhiteBG: false,
      numElimsToShow: 15,
      showResults: false,
      pausePointsUpdate: false

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*
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
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
}
*/
#results
{
  position:absolute;
  top:300px;
  left:450px;
  /*width:800px;*/
  text-align:left;
  font-size:40px;
  padding-left:15px;
  padding-top:10px;
  padding-bottom:10px;
}

#results.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 40px;
  border: 3px solid #0078b3;
  line-height: 1;
}

#results table
{
  font-size:28px;
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}

#results.whiteBG table
{
  font-size:28px;
  color:#0078b3;
  text-shadow: none;
}

#points
{
  /* Points from bottom and to the left */
  position:absolute;
  bottom:160px;
  left:40px;
  text-align:Center;
  font-size:20px;
  padding-left:5px;
  padding-top:10px;
}

#points.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 30px;
  border: 2px solid #0078b3;
  line-height: 1;
}

#elims
{
  /* Eliminations from bottom and to the right */
  color:#e30614;
  position:absolute;
  bottom:160px;
  right:50px;
  text-align:Center;
  font-size:20px;
  padding-left:10px;
  padding-top:10px;
  padding-bottom:10px;
}

#elims.whiteBG
{
  color:#e30614;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
  border-radius: 30px;
  border: 2px solid #e30614;
  line-height: 1;
}

.elim
{
  color:#e30614;
}
</style>
