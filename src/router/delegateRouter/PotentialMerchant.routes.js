export default [
  {
    path: '/PotentialMerchants',
    redirect: 'PotentialMerchants-list'
  },
  {
    path: '/PotentialMerchants/list',
    name: 'PotentialMerchants-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/PotentialMerchant/PotentialMerchantsList.vue'
      )
  },
  {
    path: '/PotentialMerchants/orders/:singlemerchent_id',
    name: 'PotentialMerchant-orders',
    props: true,

    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/PotentialMerchant/PotentialMerchantOrder.vue'
      )
  },
  {
    path: '/PotentialMerchants/invoices/:singlemerchent_id',
    name: 'PotentialMerchant-invoices',
    props: true,

    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/PotentialMerchant/PotentialMerchantInvoices.vue'
      )
  },
  {
    path: '/PotentialMerchants/bills/:singlemerchent_id',
    name: 'PotentialMerchant-bills',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/PotentialMerchant/PotentialMerchantBills.vue'
      )
  },
  {
    path: '/merchants/merchant-invoices/:singlemerchent_id',
    name: 'merchant-invoices',
    props: true,

    component: () =>
      import(
        /* webpackChunkName: "users-invoices" */ '@/pages/Merchants/UserInvoices.vue'
      )
  },
]
