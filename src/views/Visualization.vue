<template>
  <div class="visualization">
    <TimeRace />
    <flip-countdown :deadline="flipCountdownDeadline" v-bind:showDays="false"></flip-countdown>
    <Ticker />
    <PointsRace />
  </div>
</template>

<style scoped>
.visualization {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  overflow: hidden;

  font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  background-color:green;
/* Farbschema blau mit Hintergrund
    color:0078b3;
*/
/* Farbschema weis ohne Hintergrund */
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}
</style>

<script>
// @ is an alias to /src
import TimeRace from '@/components/visualizations/TimeRace.vue'
import PointsRace from '@/components/visualizations/PointsRace.vue'
import FlipCountdown from '@/components/visualizations/FlipCountdown.vue'
import Ticker from '@/components/visualizations/Ticker.vue'

export default {
  name: 'Visualization',
  components: {
    TimeRace,
    FlipCountdown,
    Ticker,
    PointsRace
  },
  computed: {
    flipCountdownDeadline () {
      return this.$store.state.displayControl.countdown.targetTime
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.setInterval(() => {
        this.$store.dispatch('updateRace')
        // console.log('Race Updated')
      }, this.$store.state.settings.updateInterval)
    })
    window.addEventListener('storage', (event) => {
    // When local storage changes, dump the list to
    // the console.
      if (['store.settings', 'store.displayControl.timeRace', 'store.displayControl.pointsRace', 'store.displayControl.countdown', 'store.displayControl.ticker'].includes(event.key)) {
        this.$store.commit('loadStoreFromStorage')
        console.log('New Change in localStorage: for ' + event.key)
      } else {
        console.log('Unknown storage Event with event key: ' + event.key)
      }
    })
  }
}
</script>
