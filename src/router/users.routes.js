export default [
  {
    path: '/users',
    redirect: 'employees-list'
  },
  {
    path: '/employees/list',
    name: 'employees-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/employees/UsersPage.vue'
      )
  },
  {
    path: '/employees/edit/:singleemploye_id',
    name: 'employees-edit',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-edit" */ '@/pages/employees/EditUserPage.vue'
      )
  },
  {
    path: '/employees/create',
    name: 'employees-create',
    component: () =>
      import(
        /* webpackChunkName: "users-create" */ '@/pages/employees/CreateUser.vue'
      )
  },
  {
    path: '/customers/list',
    name: 'customers-list',
    component: () =>
      import(
        /* webpackChunkName: "customers-list" */ '@/pages/customers/CustomersList.vue'
      )
  },
  {
    path: '/customers/bills/:singlecustomer_id',
    props: true,
    name: 'customers-bills',
    component: () =>
      import(
        /* webpackChunkName: "customers-bills" */ '@/pages/customers/CustomersBills.vue'
      )
  },
  {
    path: '/customers/edit/:singlecustomer_id',
    name: 'customers-edit',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "customers-edit" */ '@/pages/customers/CustomerDetails.vue'
      )
  },
  {
    path: '/customers/create',
    name: 'customers-create',
    component: () =>
      import(
        /* webpackChunkName: "users-create" */ '@/pages/customers/CreateUser.vue'
      )
  },
  //** */
  {
    path: '/merchents/list',
    name: 'merchents-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/Merchants/UsersPage.vue'
      )
  },
  {
    path: '/SourceIntroduction/list',
    name: 'SourceIntroduction-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/SourceIntroduction/SourceIntroductionList.vue'
      )
  },
  {
    path: '/merchents/joinRequests/list',
    name: 'merchents-joinRequests-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/Merchants/joinRequests.vue'
      )
  },
  {
    path: '/merchents/join-requests/list/:requestId',
    props: true,
    name: 'request-details',
    component: () =>
      import(
        /* webpackChunkName: "request-Details" */ '@/pages/Merchants/JoinRequestsDetails.vue'
      )
  },

  {
    path: '/merchents/edit/:singlemerchent_id',
    name: 'merchents-edit',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-edit" */ '@/pages/Merchants/EditUserPage.vue'
      )
  },
  {
    path: '/merchents/bills/:bill_id',
    name: 'merchents-bills',
    props: true,
    component: () =>
      import(/* webpackChunkName: "users-bill" */ '@/pages/Merchants/bills.vue')
  },

  {
    path: '/merchents/create',
    name: 'merchents-create',
    component: () =>
      import(
        /* webpackChunkName: "users-create" */ '@/pages/Merchants/CreateUser.vue'
      )
  },
  //** */
  {
    path: '/agents/list',
    name: 'agents-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/agents/agentsList.vue'
      )
  },
  {
    path: '/agents/orders',
    name: 'agentsOrders',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/agents/ordersList.vue'
      )
  },
  {
    path: '/delegate/info/:delegate_id',
    name: 'single-delegate',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "users-edit" */ '@/pages/agents/singleAgent.vue'
      )
  },
  {
    path: '/agents/orderRequest/list',
    name: 'admin-orders-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/agents/ordersList.vue'
      )
  }
]
