export default [
  {
    path: '/WorkPlans',
    redirect: 'WorkPlans-list'
  },
  {
    path: '/WorkPlans/list/pending',
    name: 'WorkPlans-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/WorkPlan/WorkPlans.vue'
      )
  },
  {
    path: '/WorkPlans/list/accepted',
    name: 'acceptedWorkPlans-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/WorkPlan/acceptedWorkPlans.vue'
      )
  },
  {
    path: '/WorkPlans/list/declined',
    name: 'declinedWorkPlans-list',
    component: () =>
      import(
        /* webpackChunkName: "users-list" */ '@/delegatePages/WorkPlan/declinedWorkPlans.vue'
      )
  }
]
