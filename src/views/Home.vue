<template>
  <div class="home">
    <TimeRace msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import TimeRace from '@/components/TimeRace.vue'

export default {
  name: 'Home',
  components: {
    TimeRace
  },
  mounted () {
    this.$nextTick(function () {
      window.setInterval(() => {
        this.$store.dispatch('updateRace')
        console.log('Race Updated')
      }, this.$store.state.settings.updateInterval)
    })
  }
}
</script>
