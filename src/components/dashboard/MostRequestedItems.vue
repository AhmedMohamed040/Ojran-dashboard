<template>
  <v-card>
    <v-card-title>
      {{ $t('dashboard.mostRequestedItems') }}
    </v-card-title>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <v-data-table
      v-if="!loading && role == 'Admin'"
      :headers="headers"
      :items="products"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-0"
      :item-class="cursor"
      style="min-height: 380px"
      @click:row="goToProduct"
    >
      <template v-slot:[`item.imageUrl`]="{ item }">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          width="77"
          height="77"
          class="elevation-1"
          alt="User"
          style="border-radius: 5px"
        />
        <v-img
          v-else
          src="../../assets/images/default-product.png"
          max-width="77"
          class="my-2"
        >
        </v-img>
      </template>
    </v-data-table>
    <v-data-table
      v-if="!loading && role == 'Agent'"
      :headers="headers2"
      :items="products"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-0"
      :item-class="cursor"
      style="min-height: 380px"
      @click:row="goToProduct"
    >
      <template v-slot:[`item.code`]="{ item }">
        <p>{{ String(item.code) }}</p>
      </template>
      <template v-slot:[`item.imageUrl`]="{ item }">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          width="77"
          height="77"
          class="elevation-1"
          alt="User"
          style="border-radius: 5px"
        />
        <v-img
          v-else
          src="../../assets/images/default-product.png"
          max-width="77"
          class="my-2"
        >
        </v-img>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import loading from '@/components/common/loading'

import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    loading
  },

  data() {
    return {
      role: '',
      headers: [
        {
          text: this.$i18n.t('SKU'),
          value: 'code'
        },
        {
          text: this.$i18n.t('Product.productImage'),
          value: 'imageUrl'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr'
        },

        {
          text: this.$i18n.t('Product.category'),
          value: 'category.name'
        }
      ],
      headers2: [
        {
          text: this.$i18n.t('SKU'),
          value: 'code'
        },

        {
          text: this.$i18n.t('Product.productImage'),
          value: 'imageUrl'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'name'
        },

        {
          text: this.$i18n.t('Product.category'),
          value: 'category.name'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Dashboard', ['getProducts', 'getLoading']),
    ...mapGetters('Info', ['getPermissions']),

    products() {
      return this.getProducts
    },
    loading() {
      return this.getLoading
    }
  },
  mounted() {
    this.theProducts()
  },

  methods: {
    ...mapActions('Dashboard', ['fetchProducts', 'fetchProductsAgent']),
    theProducts() {
      const role = localStorage.getItem('role')

      this.role = role
      if (role == 'Admin') {
        this.fetchProducts()
      } else if (role == 'Agent') {
        this.fetchProductsAgent()
      } else {
        this.fetchProductsAgent()
      }
    },
    goToProduct(value) {
      if (this.role == 'Admin') {
        console.log(value)
        this.$router.push({
          name: 'single-Product',
          params: { product_id: value.id }
        })
      } else {
        let found = false
        const  permission =  ['Products.View', 'Products.Edit', 'Products.Delete','Products.Create']

        for (let i = 0; i < permission.length; i++) {
          if (this.getPermissions.includes(permission[i])) {
            found = true
            break
          }
        }
        if (found || this.role == 'Admin') {
          this.$router.push({
            name: 'single-Product',
            params: { product_id: value.id }
          })
        }
      }
    },
    cursor(item) {
      let found = false
      const  permission =  ['Products.View', 'Products.Edit', 'Products.Delete','Products.Create']

      for (let i = 0; i < permission.length; i++) {
        if (this.getPermissions.includes(permission[i])) {
          found = true
          break
        }
      }
      if (found || this.role == 'Admin') {
        const rowClass = 'cursor'

        return rowClass
      }

    }
  }
}
</script>

<style>
.cursor {
  cursor: pointer;
}
</style>
