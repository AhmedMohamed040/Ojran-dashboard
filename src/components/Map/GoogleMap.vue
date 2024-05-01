<template>
  <div>
    <template>
      <div class="info-windows">
        <GmapMap
          :center="position"
          :zoom="13"
          :options="{disableDefaultUI:true}"
          map-type-id="terrain"
          style="width: 100%; height: 350px"
          @click="setPosition($event)"
        >
          <GmapMarker :position="position" :clickable="true" />
        </GmapMap>
        <v-btn @click="geolocation">Get Cuurent position</v-btn>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  props: {
    location: {
      type: Object
    }
  },
  data() {
    return {
      position: {
        lat: 21.4925,
        lng: 39.17757
      }
    }
  },
  mounted() {
    if (this.location) {
      this.position.lat = this.location.lat
      this.position.lng = this.location.long
    }
  },
  methods: {
    setPosition(e) {
      this.position.lat = e.latLng.lat()
      this.position.lng = e.latLng.lng()
      this.$emit('update-location', this.position)
    },
    geolocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
  }
}
</script>
