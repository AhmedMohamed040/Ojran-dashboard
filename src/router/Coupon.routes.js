export default [{
  path: '/coupons',
  redirect: 'coupon-list'
}, {
  path: '/coupons/list',
  name: 'coupon-list',
  component: () => import('@/pages/Coupon/CouponList.vue')
}
]
