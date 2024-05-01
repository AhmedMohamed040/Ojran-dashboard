export default [{
  path: '/PriceCategories',
  redirect: 'PriceCategories-list'
}, {
  path: '/PriceCategories/list',
  name: 'PriceCategories-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/PriceCategory/PriceCategoriesList.vue')
}

]
