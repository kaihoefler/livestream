<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html.viewstyle {
  font-family: 'Ubuntu', sans-serif;
  background-color:green;
/* Farbschema blau mit Hintergrund
    color:0078b3;
*/
/* Farbschema weis ohne Hintergrund */
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;

}

BODY.viewstyle {
  font-family: 'Ubuntu', sans-serif;
  background-color:green;
/* Farbschema blau mit Hintergrund
    color:0078b3;
*/
/* Farbschema weis ohne Hintergrund */
  color:#fff;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;

}

BODY.controllerstyle {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#appx {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
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
      } else if (['/vis'].includes(this.$route.path)) {
        document.body.className = 'viewstyle'
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
  },
  // Handle styles when the route changes
  watch: {
    '$route' () {
      this.handleStyles()
    }
  }
}
</script>
