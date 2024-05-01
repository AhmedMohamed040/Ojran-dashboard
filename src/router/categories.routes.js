export default [{
  path: '/Categories',
  redirect: 'Categories-list'
}, {
  path: '/Categories/list',
  name: 'Categories-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Categories/CategoriesList.vue')
}, {
  path: '/Categories/Create/:ParentCategoryId',
  name: 'SubCategories-Create',
  props: true,
  component: () => import(/* webpackChunkName: "users-edit" */ '@/pages/Categories/CreateSubCategories.vue')
}, {
  path: '/Categories/create',
  name: 'Categories-create',
  component: () => import(/* webpackChunkName: "users-create" */ '@/pages/Categories/CreateCategories.vue')
}
]
