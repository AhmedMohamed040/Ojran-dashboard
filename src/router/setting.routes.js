export default [
  {
    path: '/setting',
    redirect: 'setting-carousels'
  },
  {
    path: '/setting/carousels',
    name: 'setting-carousels',
    component: () =>
      import(
        /* webpackChunkName: "carousels-list" */ '@/pages/setting/carouselsEdit/carousel.vue'
      )
  },
  {
    path: '/setting/about-us',
    name: 'about-us',
    component: () =>
      import(
        /* webpackChunkName: "about-us" */ '@/pages/setting/aboutUs/aboutUs.vue'
      )
  },
  {
    path: '/setting/social-media',
    name: 'media',
    component: () =>
      import(
        /* webpackChunkName: "social-media" */ '@/pages/setting/TheMedia/socialMedia.vue'
      )
  },
  {
    path: '/setting/terms-and-conditions',
    name: 'terms-and-conditions',
    component: () =>
      import(
        /* webpackChunkName: "termsAndConditions" */ '@/pages/setting/termsAndConditions/termsAndConditions.vue'
      )
  },
  {
    path: '/setting/privacy-policy',
    name: 'privacy-policy',
    component: () =>
      import(
        /* webpackChunkName: "privacyPolicy" */ '@/pages/setting/privacyPolicy/PrivacyPolicy.vue'
      )
  },
  {
    path: '/setting/FAQ',
    name: 'FAQ',
    component: () =>
      import(
        /* webpackChunkName: "FAQ" */ '@/pages/setting/FAQ/FaqPage.vue'
      )
  },
  {
    path: '/setting/payment-methods',
    name: 'payment-methods',
    component: () =>
      import(
        /* webpackChunkName: "paymentMethods" */ '@/pages/setting/payment/paymentMethods.vue'
      )
  },
  {
    path: '/setting/tax',
    name: 'tax',
    component: () =>
      import(
        /* webpackChunkName: "tax" */ '@/pages/setting/TheTax/TaxSetting.vue'
      )
  }

]
