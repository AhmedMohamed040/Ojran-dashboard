export default [{
  path: '/Products',
  redirect: 'Products-list'
},
{
  path: '/Products/list',
  name: 'Products-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Product/ProductList.vue')
}
,
{
  path: '/Products/create',
  name: 'Products-create',
  component: () => import(/* webpackChunkName: "users-create" */ '@/pages/Product/CreateProduct.vue')
},
{
  path: '/Edit/Product/:editProduct_id',
  name: 'Edit-Product',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Product/EditProduct.vue')
}
,
{
  path: '/single/Product/:product_id',
  name: 'single-Product',
  props: true,
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Product/singleProduct.vue')
}
,
{
  path: '/Products/manage-stock/:product_id',
  name: 'manage-stock',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/Product/manageStock.vue')
}
]
