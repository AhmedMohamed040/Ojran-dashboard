<template>
  <v-autocomplete
    v-model="id"
    :label="$t('geography.city') + (isRequired? ' *': '')"
    outlined
    :disabled="!RegionId"
    :rules="requiredRule"
    :loading="isLoading"
    :search-input.sync="search"
    return-object
    :no-filter="true"
    :items="
      getCitiesList.map(({ id, name }) => ({
        text: name,
        value: id
      }))
    "
    clearable
    open-on-clear
    @change="$emit('SelectCityId', id.value)"
  ></v-autocomplete>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    CityId: {
      type: String,
      default: ''
    },
    CountryId: {
      type: String,
      default: ''
    },
    RegionId: {
      type: String,
      default: ''
    },
    requiredRule: Array,
    isRequired: Boolean
  },
  data() {
    return {
      id: this.CityId,
      isLoading: false,
      search: null
    }
  },
  computed: {
    ...mapGetters('DelegateGeography', ['getCitiesList'])
  },

  methods: {
    ...mapActions('DelegateGeography', ['fetchCities'])
  },
  watch: {
    CityId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.id = newVal
        }
      },
      immediate: true
    },
    search (val) {
      this.isLoading = true
      this.fetchCities({ 'SearchString': val })
      this.isLoading = false
    }
  }
}
</script>
