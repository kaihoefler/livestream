<template>
  <div class="">
    <TimeRace msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import TimeRace from '@/components/TimeRace.vue'

export default {
  name: 'Visualization',
  components: {
    TimeRace
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
      if (['store.settings', 'store.displayControl.timeRace'].includes(event.key)) {
        this.$store.commit('loadStoreFromStorage')
        console.log('New Change in localStorage: for ' + event.key)
      } else {
        console.log('Unknown storage Event with event key: ' + event.key)
      }
    })
  }
}
</script>
