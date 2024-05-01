<template>
  <div class="my-2">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Product.productDetails') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div>
      <v-switch
        :label="more ? $t('Product.advanced') : $t('Product.basic')"
        class="v"
        v-model="more"
      ></v-switch>
    </div>

    <div>
      <div class="basic" v-if="!more">
        <Basic :Product="getProduct" />
      </div>
      <div class="advanced" v-if="more">
        <Advanced :Product="getProduct" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Basic from './ProductInfo/Basic.vue'
import Advanced from './ProductInfo/Advanced.vue'
export default {
  components: {
    Basic,
    Advanced
  },
  data() {
    return {
      more: false,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Products'),
          exact: true,
          to: '/Products/list'
        },
        {
          text: this.$i18n.t('Product.productDetails')
        }
      ],

    }
  },
  computed: {
    ...mapGetters('Product', ['getProduct']),
  },
  methods: {

 ...mapActions('Product', [
      'fetchProduct',
    ]),
  },
  mounted() {
    this.fetchProduct(this.$route.params.product_id);
  },
}
</script>
<style>
.photo_content {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  width: fit-content;
  margin: 10px auto;
}
.saveProduct {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.saveProductbtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
