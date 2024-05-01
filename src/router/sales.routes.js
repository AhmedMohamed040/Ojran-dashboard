export default [
  {
    path: '/sales',
    redirect: 'orders-return'
  },
  {
    path: '/sales/orders-return',
    name: 'orders-return',
    component: () =>
      import(
        /* webpackChunkName: "oerders-return" */ '@/pages/sales/OrdersReturn.vue'
      )
  },
  {

    path: '/sales/orders-return/:orderId',
    name: 'order-details',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "oerder-details" */ '@/pages/sales/OrderDetails.vue'
      )

  }

]
