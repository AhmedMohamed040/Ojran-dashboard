<template>
  <v-autocomplete
    v-model="id"
    :disabled="!CountryId"
    outlined
    :rules="requiredRule"
    :items="
      getRegionsList.map(({ id, name }) => ({
        text: name,
        value: id
      }))
    "
    clearable
    open-on-clear
    :search-input.sync="search"
    return-object
    :no-filter="true"
    :label="$t('geography.region') + (isRequired? ' *': '')"
    @change="
      $emit('SelectRegionId', id? id.value : '')
      fetchCities()
    "
  ></v-autocomplete>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    RegionId: {
      type: String,
      default: ''
    },
    CountryId: {
      type: String,
      default: ''
    },
    requiredRule: Array,
    isRequired: Boolean
  },
  data() {
    return {
      id: this.RegionId,
      isLoading: false,
      search: null
    }
  },
  computed: {
    ...mapGetters('Geography', ['getRegionsList'])
  },

  methods: {
    ...mapActions('Geography', ['fetchRegions']),
    fetchCities() {
      this.$store.dispatch('Geography/fetchCities', {
        CountryId: this.CountryId,
        RegionId: this.id?.value
      })
    }
  },
  watch: {
    RegionId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.id = newVal
          this.$store.dispatch('Geography/fetchCities', {
            CountryId: this.CountryId,
            RegionId: this.RegionId
          })
        }
      },
      immediate: true
    },
    search (val) {
      this.isLoading = true
      this.fetchRegions({ 'SearchString': val })
      this.isLoading = false
    }
  }
}
</script>
