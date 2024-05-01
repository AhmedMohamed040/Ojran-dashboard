<template>
  <v-autocomplete
    v-model="id"
    :items="
      getCountriesList.map(({ id, name }) => ({
        text: name,
        value: id
      }))
    "
    :label="$t('geography.country') + (isRequired? ' *': '')"
    outlined
    :rules="requiredRule"
    :loading="isLoading"
    :search-input.sync="search"
    return-object
    :no-filter="true"
    clearable
    open-on-clear
    @change="handleChange"
  ></v-autocomplete>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    CountryId: {
      type: String,
      default: ''
    },
    requiredRule: Array,
    isRequired: Boolean
  },
  data() {
    return {
      id: this.CountryId,
      isLoading: false,
      search: null
    }
  },
  computed: {
    ...mapGetters('DelegateGeography', ['getCountriesList'])
  },

  methods: {
    ...mapActions('DelegateGeography', ['fetchCountries']),
    handleChange() {
      this.$emit('SelectCountryId', this.id?.value)
      this.$store.dispatch('DelegateGeography/fetchRegions', { 'CountryId': this.id?.value })
    },
    Edit() {
      if (this.CountryId) {
        this.$store.dispatch('DelegateGeography/fetchRegions', { 'CountryId': this.id?.value })
      }
    }
  },
  watch: {
    CountryId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.id = newVal
        }
      },
      immediate: true
    },
    search (val) {
      this.isLoading = true
      this.fetchCountries({ 'SearchString': val })
      this.isLoading = false
    }
  },
  mounted() {
    this.fetchCountries()
    this.Edit()
  }

}
</script>
