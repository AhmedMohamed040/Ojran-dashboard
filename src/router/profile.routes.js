export default [
  {
    path: '/myProfile',
    name: 'myProfile',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/pages/myProfile/EditUserPage.vue'
      )
    
  },
  {
    path: '/notififcations',
    name: 'notififcations',
    component: () =>
      import(
      /* webpackChunkName: "users-list" */ '@/pages/myProfile/NotififcationsPage.vue'
      )
  }
  
]
