export default [{
  path: '/PotentialMerchantVisit',
  redirect: 'PotentialMerchantVisit-list'
}, {
  path: '/PotentialMerchantVisit/list',
  name: 'PotentialMerchantVisit-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/delegatePages/PotentialMerchantVisit/PotentialMerchantVisitList.vue')
}

]
