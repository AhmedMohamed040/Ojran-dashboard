export default [{
  path: '/ProductAttributes',
  redirect: 'ProductAttributes-list'
}, {
  path: '/ProductAttributes/list',
  name: 'ProductAttributes-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/ProductAttribute/ProductAttributesList.vue')
}

]
