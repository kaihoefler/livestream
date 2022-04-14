<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title is-info">
        Ticker Settings
      </p>
    </header>
    <div class="card-content">
      <div class="field">
        <label style="center" class="checkbox"><input v-model="settings.show" type="checkbox"> Show Ticker visualization</label>
      </div>
      <div v-bind:class="{ 'is-hidden': !settings.show }">
        <div class="field">
          <label class="label">Text Line 1</label>
          <input v-model="settings.line1" class="input" type="text" placeholder="Enter Text here" >
        </div>
        <div class="field">
          <label class="label">Text Line 2</label>
          <input v-model="settings.line2" class="input" type="text" placeholder="Enter Text here" >
        </div>
        <div class="field">
          <label class="checkbox"><input v-model="settings.styleWhiteBG" type="checkbox"> Activate White Background style</label>
        </div>
        <div class="field">
          <label class="checkbox"><input v-model="settings.laufschrift" type="checkbox"> Activate Marquee (Laufschrift)</label>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <button v-on:click="activateSettings" :disabled=!isDirty class="button is-primary">Activate Settings</button>
      <button v-on:click="restoreSettings" :disabled=!isDirty class="button is-secondary">Restore Settings</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'TickerSettings',
  props: {
    msg: String
  },
  computed: {
    // use read only -> Values come from the store
    storeSettings () {
      return this.$store.state.displayControl.ticker
    }

  },

  data: function () {
    return {
      settings: {
        show: true,
        line1: '',
        line2: '',
        styleWhiteBG: false,
        laufschrift: false
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
    activateSettings () {
      this.$store.commit('setDisplayControlTicker', this.settings)
      this.isDirty = false
    },

    restoreSettings () {
      Object.assign(this.settings, this.$store.state.displayControl.ticker)
      this.isDirty = false
    }
  },

  beforeMount () {
    Object.assign(this.settings, this.$store.state.displayControl.ticker)
    this.isDirty = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
