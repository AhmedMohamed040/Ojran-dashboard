<template>
  <div class="my-2">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Product.createProduct') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <div>
      <v-switch
        v-model="more"
        :label="more ? $t('Product.advanced') : $t('Product.basic')"
        class="v"
      ></v-switch>
    </div>

    <div>
      <div v-if="!more" class="basic">
        <Basic :new-product="product" @fillProduct="product = $event" />
      </div>
      <div v-if="more" class="advanced">
        <Advanced :new-product="product" @fillProduct="product = $event" />
      </div>
    </div>
  </div>
</template>

<script>
import Basic from './ProductForm/Basic.vue'
import Advanced from './ProductForm/Advanced.vue'
export default {
  components: {
    Basic,
    Advanced
  },
  data() {
    return {
      more: false,
      product: {},
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Products'),
          to: '/Products/list',
          exact: true
        },
        {
          text: this.$i18n.t('Product.createProduct')
        }
      ]
    }
  }
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
