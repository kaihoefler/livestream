<template>
  <div id="ticker"  v-bind:class="{ whiteBG: displayControl.styleWhiteBG}" v-if="displayControl.show">
    <div id="marquee" v-bind:class="{ marquee: displayControl.laufschrift}"><span>
      <div id="line1"  >{{displayControl.line1}} &nbsp;</div>
      <div id="line2"  >{{displayControl.line2}}</div>
    </span></div>
  </div>
</template>

<script>

export default {
  name: 'Ticker',
  props: {
    msg: String
  },

  computed: {

    displayControl () {
      return this.$store.state.displayControl.ticker
    }

  },
  data: function () {
    return {
      nothing: true

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ticker
{
  position:absolute;
  top:850px;
  left:300px;
  width:1100px;
  height:100px;
  font-size:40px;
  text-align:center;
  border-left: solid #e30614;
  border-right: solid #e30614;
  padding-left:10px;
  padding-right:10px;

}

#line2
{
  padding-top:16px;
  font-size:20px;
}

#ticker.whiteBG
{
  color:#0078b3;
  background-color: rgba(255, 255, 255, 0.9);
  text-shadow: none;
    border-radius: 40px;
  border: 4px solid #0078b3;
}

.marquee {
  max-width: 100vw; /* iOS braucht das */
  white-space: nowrap;
  overflow: hidden;
  /* hier evtl. noch font-size, color usw. */
}

.marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 10s linear infinite;
}

/* Optional: mouseover (oder Tipp auf dem Touchscreen) pausiert die Laufschrift */
.marquee span:hover {
  animation-play-state: paused;
}

/* Make it move */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

</style>
