export default [{
  path: '/Geography',
  redirect: 'countries-list'
}, {
  path: '/countries/list',
  name: 'countries-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Geography/CountriesList.vue')
}, {
  path: '/regions/list',
  name: 'regions-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Geography/RegionsList.vue')
}, {
  path: '/cities/list',
  name: 'cities-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Geography/CitiesList.vue')
}

]
