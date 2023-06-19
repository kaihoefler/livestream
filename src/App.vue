<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>

@font-face {
  font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-style: normal;
  font-weight: 700;
  src: local('Ubuntu Bold'), local('Ubuntu-Bold'), url(assets/fonts/ubuntu.woff) format('woff');
}

html {
  overflow-y: auto !important; /* override bulma */
}

#appx {
  font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.truncated-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script>
export default {
  name: 'livestream',
  methods: {
    handleStyles () {
      // controllerstyle to the body tag for the home page
      if (['/'].includes(this.$route.path)) {
        document.body.className = 'controllerstyle'
      }

      // (document.body.classList.contains('controllerstyle')) document.body.className = 'viewstyle'
      // Pink style to the body tag for all other pages
    },
    handleQueryParams () {
      var params = []
      var hash
      if (window.location.href.indexOf('?') === -1) return
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=')
        params[hash[0]] = hash[1]
      }
      if ('refSpeed' in params && params.refSpeed !== undefined) {
        this.$store.state.displayControl.timeRace.showRefSpeed = true
        this.$store.state.displayControl.timeRace.refSpeed = parseFloat(params.refSpeed)
      }
    }
  },
  // Handle styles when the app is initially loaded
  mounted () {
    this.handleStyles()
    this.handleQueryParams()

    require('@/assets/traina_bulma.css')
  },
  // Handle styles when the route changes
  watch: {
    '$route' () {
      this.handleStyles()
    }
  }
}
</script>
