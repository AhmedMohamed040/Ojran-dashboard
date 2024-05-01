export default [
  {
    path: '/sales/orders',
    name: 'all-orders',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/allOrders/allOrders.vue'
      )
  },
  {
    path: '/sales/orders/:orderId',
    name: 'details-of-order',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "details-of-order" */ '@/pages/allOrders/OrderDetails.vue'
      )
  }
]
