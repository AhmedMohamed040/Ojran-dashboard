export default [{
  path: '/GiftCard',
  redirect: 'GiftCard-list'
}, {
  path: '/GiftCard/list',
  name: 'GiftCard-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/GiftCard/GiftCardList.vue')
}

]
