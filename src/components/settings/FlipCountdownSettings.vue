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
      <div class="field">
        <label class="label">Target Time</label>
        <input v-model="settings.targetTime" class="input" type="text">
      </div>
      <div class="field">
        <label class="checkbox"><input v-model="settings.showLabel" type="checkbox"> Show Label</label>
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="saveSettings" :disabled=!isDirty class="button is-primary">Save Time Race Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Time Race Settings</button>
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
        showLabel: true
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
