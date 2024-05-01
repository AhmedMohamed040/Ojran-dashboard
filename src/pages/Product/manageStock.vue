<template>
  <div class="my-2">
    <div class="d-flex align-center py-3">
      <div>
        <h1>{{ $t('Product.manageStock') }}</h1>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-row class="mb-1">
      <v-col cols="12">
        <h3>
          {{ $t('Product.itemInfo') }}
        </h3></v-col>
      <v-col cols="3">{{ $t('common.nameInArabic') }}</v-col>
      <v-col cols="9"> {{ getProduct.nameAr }}</v-col>

      <v-col cols="3">{{ $t('common.nameInEnglish') }}</v-col>
      <v-col cols="9"> {{ getProduct.nameEn ? getProduct.nameEn : '' }}</v-col>

      <v-col cols="3">{{ $t('Product.category') }}</v-col>
      <v-col cols="9">
        {{ getProduct.category ? getProduct.category.name : '' }}</v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <div
          class="features"
          :class="[manage == 'info' ? 'featuresActive' : '']"
          @click="manage = 'info'"
        >
          <h3 class="my-3 mx-auto">
            {{ $t('Product.stockInfo') }}
          </h3>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div
          class="features"
          :class="[manage == 'add' ? 'featuresActive' : '']"
          @click="manage = 'add'"
        >
          <h3 class="my-3 mx-auto">
            {{ $t('Product.addStock') }}
          </h3>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div
          class="features"
          :class="[manage == 'transfer' ? 'featuresActive' : '']"
          @click="manage = 'transfer'"
        >
          <h3 class="my-3 mx-auto">
            {{ $t('Product.transferStock') }}
          </h3>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div
          class="features"
          :class="[manage == 'destroy' ? 'featuresActive' : '']"
          @click="manage = 'destroy'"
        >
          <h3 class="my-3 mx-auto">
            {{ $t('Product.stockAdjustment') }}
          </h3>
        </div>
      </v-col>
    </v-row>
    <transition name="fade" mode="out-in">
      <component :is="manage" />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import add from './stock/add.vue'
import transfer from './stock/transfer.vue'
import destroy from './stock/destroy.vue'
import info from './stock/info.vue'
export default {
  components: {
    add,
    transfer,
    destroy,
    info
  },
  data() {
    return {
      manage: 'info',
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Products'),
          to: '/Products/list',
          exact: true
        },
        {
          text: this.$i18n.t('Product.manageStock')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Product', ['getProduct'])
  },
  methods: {
    ...mapActions('Product', ['fetchProduct'])
  },
  mounted() {
    this.fetchProduct(this.$route.params.product_id)
  }
}
</script>
<style lang="scss" scoped>
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
.features {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 15px;
  transition: all 0.6s ease-in-out;
}
.features:hover {
  cursor: pointer;
  background-color: rgb(255, 90, 241);
  color: white;
  transform: scale(1.1);
}
.featuresActive {
  cursor: pointer;
  background-color: rgb(62, 159, 250);
  color: #fff;
  transform: scale(1.1);
}
.fade-enter {
  transform: translateY(-60px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-activ {
  transition: all 0.6s ease-in-out;
}
.fade-leave {
  transform: translateY(60px);
  opacity: 0;
}
</style>
