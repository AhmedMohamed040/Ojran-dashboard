export default [{
  path: '/Warehouse',
  redirect: 'Warehouse-list'
}, {
  path: '/Warehouse/list',
  name: 'Warehouse-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Warehouse/WarehouseList.vue')
}

]
