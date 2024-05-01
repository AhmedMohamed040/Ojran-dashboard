export default [
  {
    path: '/footer-setting',
    redirect: 'footer-about-us'
  },
  {
    path: '/footer-setting/about-us',
    name: 'footer-about-us',
    component: () =>
      import(
        /* webpackChunkName: "about-us" */ '@/pages/setting/aboutUs/aboutUs.vue'
      )
  },
  {
    path: '/footer-setting/short-about',
    name: 'short-about',
    component: () =>
      import(
      /* webpackChunkName: "social-media" */ '@/pages/setting/ShortAbout/ShortAbout.vue'
      )
  },
  {
    path: '/footer-setting/social-media',
    name: 'footer-media',
    component: () =>
      import(
        /* webpackChunkName: "social-media" */ '@/pages/setting/TheMedia/socialMedia.vue'
      )
  },
  {
    path: '/footer-setting/contact-us',
    name: 'footer-contact',
    component: () =>
      import(
        /* webpackChunkName: "social-media" */ '@/pages/setting/contact/ContactUs.vue'
      )
  },
  {
    path: '/footer-setting/terms-and-conditions',
    name: 'terms-and-conditions',
    component: () =>
      import(
        /* webpackChunkName: "termsAndConditions" */ '@/pages/setting/termsAndConditions/termsAndConditions.vue'
      )
  },
  {
    path: '/footer-setting/privacy-policy',
    name: 'privacy-policy',
    component: () =>
      import(
        /* webpackChunkName: "privacyPolicy" */ '@/pages/setting/privacyPolicy/PrivacyPolicy.vue'
      )
  }

]
