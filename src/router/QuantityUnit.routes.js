export default [{
  path: '/QuantityUnit',
  redirect: 'QuantityUnit-list'
}, {
  path: '/QuantityUnit/list',
  name: 'QuantityUnit-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/QuantityUnit/QuantityUnitList.vue')
}

]
