import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// Routes
import PagesRoutes from './pages.routes'
import UsersRoutes from './users.routes'
import CategoriesRoutes from './categories.routes'
import ManufacturersRoutes from './Manufacturer.routes'
import PriceCategoriesRoutes from './PriceCategories.routes'
import QuantityUnitsRoutes from './QuantityUnit.routes'
import GiftCardRoutes from './GiftCard.routes'
import CouponRoutes from './Coupon.routes'
import WarehousesRoutes from './warehouses.routes'
import NationalityRoutes from './Nationality.routes'
import ProductAttributesRoutes from './ProductAttribute.routes'
import GeographyRoutes from './Geography.routes'
import ProductsRoutes from './Product.routes'
import EcommerceRoutes from './ecommerce.routes'
import WorkplanRoutes from './Workplan.routes'
import ProfileRoutes from './profile.routes'
import AllOrdersRoutes from './allOrders.routes'
//  delegate routes
import PotentialMerchantsRoutes from './delegateRouter/PotentialMerchant.routes'
import WorkPlansRoutes from './delegateRouter/WorkPlans.routes'
import PotentialMerchantVisitRoutes from './delegateRouter/PotentialMerchantVisit.routes'
import OrdersRoutes from './delegateRouter/orders.routes'
import settingRoutes from './setting.routes'
import sales from './sales.routes'
import complaintsRoutes from './complaints.routes'
import footerRoutes from './footer.routes'
Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/dashboard/analytics'
  },
  {
    path: '/dashboard/analytics',
    name: 'dashboard-analytics',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/dashboard/DashboardPage.vue'
      )
  },
  ...PagesRoutes,
  ...UsersRoutes,
  ...CategoriesRoutes,
  ...ManufacturersRoutes,
  ...PriceCategoriesRoutes,
  ...QuantityUnitsRoutes,
  ...GiftCardRoutes,
  ...CouponRoutes,
  ...WarehousesRoutes,
  ...ProductAttributesRoutes,
  ...NationalityRoutes,
  ...GeographyRoutes,
  ...ProductsRoutes,
  ...EcommerceRoutes,
  ...WorkplanRoutes,
  ...ProfileRoutes,
  // delegate routes
  ...PotentialMerchantsRoutes,
  ...WorkPlansRoutes,
  ...PotentialMerchantVisitRoutes,
  ...OrdersRoutes,
  ...AllOrdersRoutes,
  ...settingRoutes,
  ...sales,
  ...complaintsRoutes,
  ...footerRoutes,
  {
    path: '/blank',
    name: 'blank',
    component: () =>
      import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () =>
      import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
      layout: 'error'
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/auth/signin' && store.getters.isAuthenticated) {
    console.log(store.getters.isAuthenticated)

    //if user is already logged in and tries to go to login
    return next('/') //redirect to home
  } else if (
    (to.path === '/auth/signin' ||
      to.path === '/auth/signup' ||
      to.path === '/auth/forgot-password' ||
      to.path === '/auth/reset-password' ||
      to.path === '/auth/forgot-password') &&
    !store.getters.isAuthenticated
  ) {
    //if user is not logged in and tries to go to login or signup page
    return next()
  } else {
    //if user is logged in and tries to go to another page
    if (store.getters.isAuthenticated) {
      return next()
    } else {
      //if user is not logged in and tries to go to another page
      return next('/auth/signin')
    }
  }
})

export default router
