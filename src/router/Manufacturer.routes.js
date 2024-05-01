export default [{
  path: '/Manufacturer',
  redirect: 'Manufacturer-list'
}, {
  path: '/Manufacturer/list',
  name: 'Manufacturer-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Manufacturer/ManufacturersList.vue')
}

]
