<template>
  <div class="">
    <TimeRace />
    <flip-countdown id="countdown" :deadline="flipCountdownDeadline" v-bind:showDays="false"></flip-countdown>
    <Ticker />
  </div>
</template>

<style scoped>
#countdown
{
  position:absolute;
  top:50px;
  left:1250px;
  height:200px;
  width:400px;
}
</style>

<script>
// @ is an alias to /src
import TimeRace from '@/components/visualizations/TimeRace.vue'
import FlipCountdown from '@/components/visualizations/FlipCountdown.vue'
import Ticker from '@/components/visualizations/Ticker.vue'

export default {
  name: 'Visualization',
  components: {
    TimeRace,
    FlipCountdown,
    Ticker
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
      if (['store.settings', 'store.displayControl.timeRace', 'store.displayControl.countdown', 'store.displayControl.ticker'].includes(event.key)) {
        this.$store.commit('loadStoreFromStorage')
        console.log('New Change in localStorage: for ' + event.key)
      } else {
        console.log('Unknown storage Event with event key: ' + event.key)
      }
    })
  }
}
</script>
