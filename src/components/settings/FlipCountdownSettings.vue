<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title is-info">
        Countdown Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label style="center" class="checkbox"><input v-model="settings.show" type="checkbox"> Show Countdown</label>
      </div>
      <div v-bind:class="{ 'is-hidden': !settings.show }">
        <div class="field">
          <label class="label">Target Time</label>
            <div class="field is-horizontal has-addons">
                         <input v-model="settings.targetTime" class="input" type="text">
            <button v-on:click="setTargetTimeToday" class="button">Set to Today</button>
          </div>
        </div>
        <div class="field">
          <label class="checkbox"><input v-model="settings.showLabel" type="checkbox"> Show Label</label>
        </div>
        <div class="field">
          <label class="checkbox"><input v-model="settings.showSubText" type="checkbox"> Show Sub Text</label>
        </div>
        <div class="field">
          <label class="label">Sub Text Line</label>
          <input v-model="settings.subText" class="input" type="text" placeholder="Enter Text here" >
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="saveSettings" :disabled=!isDirty class="button is-primary">Save Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'TimeRaceSettings',
  props: {
    msg: String
  },
  computed: {
    // use read only -> Values come from the store
    storeSettings () {
      return this.$store.state.displayControl.countdown
    }

  },

  data: function () {
    return {
      settings: {
        show: true,
        targetTime: new Date().toISOString().split('T')[0] + ' 23:59',
        showLabel: true,
        showSubText: false,
        subText: ''
      },

      isDirty: false
    }
  },

  watch: {
    settings: {
      handler (val, oldVal) {
        this.isDirty = true
      },
      deep: true
    }
  },

  methods: {
    saveSettings () {
      this.$store.commit('setDisplayControlCountdown', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.displayControl.countdown)
      this.isDirty = false
    },

    setTargetTimeToday () {
      this.settings.targetTime = new Date().toISOString().split('T')[0] + ' 23:59'
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.displayControl.countdown)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
