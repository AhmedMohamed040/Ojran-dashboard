export default [{
  path: '/Nationality',
  redirect: 'Nationality-list'
}, {
  path: '/Nationality/list',
  name: 'Nationality-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Nationality/NationalitiesList.vue')
}

]
