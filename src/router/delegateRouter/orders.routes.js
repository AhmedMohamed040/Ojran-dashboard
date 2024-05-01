export default [
  {
    path: '/orders',
    redirect: 'orders-list'
  },
  {
    path: '/orders/list',
    name: 'orders-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/orders/ordersList.vue'
      )
  },
  {
    path: '/orders/create/:merchant',
    name: 'create-order',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/orders/createOrder.vue'
      )
  },
  {
    path: '/orders/add-item/:merchant/:orderId',
    name: 'add-item',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/orders/addItem.vue'
      )
  }
]
