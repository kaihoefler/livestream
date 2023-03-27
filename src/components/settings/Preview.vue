<template>
  <div class="card">
    <header class="card-header notification is-success">
      <p class="card-header-title">
        Preview
      </p>
    </header>
    <div class="card-content">
      <div class="preview">
        <div class="preview-viz">
          <Visualization />
        </div>
      </div>
    </div>
  </div>
</template>

<style >
.preview {
  width: fit-content;
  border-width: 5px;
  border-color: black;
  border-style: solid;
  margin-left: auto;
  margin-right: auto;
}

.preview-viz {
  position: relative;
  height: 1080px;
  width: 1920px;
  zoom: 0.3;
}
</style>

<script>
// @ is an alias to /src
import Visualization from '@/views/Visualization.vue'

export default {
  name: 'Preview',
  components: {
    Visualization
  }
}
</script>
