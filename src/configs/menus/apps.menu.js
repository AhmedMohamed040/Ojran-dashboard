export default [
  // { icon: 'mdi-email-outline', key: 'menu.email', text: 'Email', link: '/apps/email' },
  // { icon: 'mdi-forum-outline', key: 'menu.chat', text: 'Chat', link: '/apps/chat' },
  {
    icon: 'mdi-cart-outline',
    key: 'menu.sales',
    text: 'sales',
    regex: /^\/sales/,
    permission: ['sales.View', 'sales.Edit', 'sales.Delete', 'sales.Status', 'sales.Create', 'Orders.View', 'Orders.Edit', 'Orders.Delete', 'Orders.Status', 'Orders.Create'],
    items: [
      /*  { key: 'menu.sales',
        text: 'List',
        icon: 'mdi-cart-arrow-down',
        permission: ['sales.View', 'sales.Edit', 'sales.Delete', 'sales.Status', 'sales.Create'],
        link: '/utility/coming-soon'
      }, */
      { key: 'menu.returnsOrders',
        text: 'Edit',
        icon: 'mdi-cart-arrow-up',
        permission: ['sales.View', 'sales.Edit', 'sales.Delete', 'sales.Status', 'sales.Create'],

        link: '/sales/orders-return'
      },
      {
        icon: 'mdi-store',
        key: 'menu.orders',
        text: 'Orders',
        permission: ['Orders.View', 'Orders.Edit', 'Orders.Delete', 'Orders.Status', 'Orders.Create'],
        link: '/sales/orders'
      }

    ]
  },
  {
    icon: 'mdi-cards mdi-spin',
    key: 'menu.Catalog',
    text: 'Catalog',
    permission: ['Categories.View', 'Categories.Edit', 'Categories.Delete','Categories.Create', 'Warehouses.View', 'Warehouses.Edit', 'Warehouses.Delete','Warehouses.Create', 'brands.View', 'brands.Edit', 'brands.Delete','brands.Create', 'QuantityUnits.View', 'QuantityUnits.Edit', 'QuantityUnits.Delete','QuantityUnits.Create', 'ProductAttributes.View', 'ProductAttributes.Edit', 'ProductAttributes.Delete','ProductAttributes.Create', 'Products.View', 'Products.Edit', 'Products.Delete','Products.Create', 'Gifts.View', 'Gifts.Edit', 'Gifts.Delete','Gifts.Create', 'Coupons.View', 'Coupons.Edit', 'Coupons.Delete','Coupons.Create'],
    regex: /^\/Catalog/,
    items: [
      {
        icon: 'mdi-sitemap',
        key: 'menu.Categories',
        text: 'Categories',
        permission: ['Categories.View', 'Categories.Edit', 'Categories.Delete','Categories.Create'],
        link: '/Categories/list'
      },
      {
        icon: 'mdi-warehouse',
        key: 'menu.warehouses',
        text: 'Warehouses',
        permission: ['Warehouses.View', 'Warehouses.Edit', 'Warehouses.Delete','Warehouses.Create'],
        link: '/Warehouse/list'
      },
      {
        icon: 'mdi-account-reactivate-outline',
        key: 'menu.Manufacturers',
        text: 'Manufacturers',
        permission: ['brands.View', 'brands.Edit', 'brands.Delete','brands.Create'],
        link: '/Manufacturer/list'
      },

      {
        icon: 'mdi-collage',
        key: 'menu.QuantityUnits',
        text: 'QuantityUnits',
        permission: ['QuantityUnits.View', 'QuantityUnits.Edit', 'QuantityUnits.Delete','QuantityUnits.Create'],
        link: '/QuantityUnit/list'
      },
     /*  {
        icon: 'mdi-details',
        key: 'ProductAttributes.productAttributes',
        text: 'ProductAttributes',
        permission: ['ProductAttributes.View', 'ProductAttributes.Edit', 'ProductAttributes.Delete','ProductAttributes.Create'],
        link: '/ProductAttributes/list'
      }, */
      {
        icon: 'mdi-bag-checked',
        key: 'menu.Products',
        text: 'Products',
        link: '/Products/list',
        permission: ['Products.View', 'Products.Edit', 'Products.Delete','Products.Create']
      },
      {
        icon: 'mdi-gift',
        key: 'menu.GiftCards',
        text: 'GiftCards',
        permission: ['Gifts.View', 'Gifts.Edit', 'Gifts.Delete','Gifts.Create'],
        link: '/GiftCard/list'
      },
      {
        icon: 'mdi-gift',
        key: 'menu.Coupons',
        text: 'Coupons',
        permission: ['Coupons.View', 'Coupons.Edit', 'Coupons.Delete','Coupons.Create'],
        link: '/coupons/list'
      }
    ]
  },
  {
    icon: 'mdi-keyboard-settings',
    key: 'menu.systemVariables',
    text: 'systemVariables',
    permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create', 'Nationalities.View', 'Nationalities.Edit', 'Nationalities.Delete','Nationalities.Create'],
    regex: /^\/systemVariables/,

    items: [
      {
        key: 'geography.countries',
        text: 'countries',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        icon: 'mdi-flag-variant',
        link: '/countries/list'

      },
      { key: 'geography.regions',
        text: 'regions',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        icon: 'mdi-map',
        link: '/regions/list'
      },
      { key: 'geography.cities',
        text: 'cities',
        icon: 'mdi-city',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/cities/list'
      },
      {
        key: 'geography.Nationalities',
        text: 'Nationalities',
        icon: 'mdi-flag-variant-outline',
        permission: ['Nationalities.View', 'Nationalities.Edit', 'Nationalities.Delete','Nationalities.Create'],
        link: '/Nationality/list'
      }
    ]
  },
  {
    icon: 'mdi-account-multiple-outline',
    key: 'menu.users',
    text: 'Users',
    permission: ['Users.View', 'Users.Edit', 'Users.Delete','Users.Create'],
    regex: /^\/users/,
    items: [
      {
        icon: 'mdi-account-multiple-outline',
        key: 'menu.employees',
        text: 'employees',
        permission: ['Users.View', 'Users.Edit', 'Users.Delete','Users.Create'],
        link: '/employees/list'
      },


    ]
  },
  {
    icon: 'mdi-sitemap',
    key: 'menu.agents',
    text: 'agents',
    permission: ['Agents.View', 'Agents.Edit', 'Agents.Delete', 'Agents.Create'],
    regex: /^\/agents/,
    items: [

      {
        icon: 'mdi-format-list-checkbox',
        key: 'menu.workplans',
        text: 'Todo',
        permission: ['WorkPlans.View', 'WorkPlans.Edit', 'WorkPlans.Delete', 'WorkPlans.Create'],
        link: '/workplans',
        items: [
          {
            icon: 'mdi-format-list-checkbox',
            key: 'menu.WorkPlanTypes',
            text: 'Todo',
            permission: ['WorkPlanTypes.View', 'WorkPlanTypes.Edit', 'WorkPlanTypes.Delete', 'WorkPlanTypes.Create'],

            link: '/workplan-types'
          },
          {
            icon: 'mdi-format-list-checkbox',
            key: 'menu.workplans',
            permission: ['WorkPlans.View', 'WorkPlans.Edit', 'WorkPlans.Delete', 'WorkPlans.Create'],
            text: 'Todo',
            link: '/workplans'
          }
        ]
      },

      {
        key: 'menu.agents',
        text: 'Agents',
        permission: ['Agents.View', 'Agents.Edit', 'Agents.Delete', 'Agents.Create'],
        link: '/agents/list'
      },
      {
        key: 'menu.ordersAgents',
        text: 'ordersAgents',
        permission: ['Agents.View', 'Agents.Edit', 'Agents.Delete', 'Agents.Create'],
        link: '/agents/orders'
      }
    ]
  },
  {
    icon: 'mdi-account-cash',
    key: 'menu.customers',
    text: 'Merchants',
    permission: ['Merchants.View', 'Merchants.Edit', 'Merchants.Delete', 'Merchants.Create'],
    regex: /^\/users/,
    items: [
      {
        key: 'menu.Merchants',
        text: 'Merchants',
        permission: ['Merchants.View', 'Merchants.Edit', 'Merchants.Delete', 'Merchants.Create'],
        link: '/merchents/list'
      },
      {
        icon: 'mdi-account',
        key: 'customers.customers',
        text: 'customers',
        permission: ['Users.View', 'Users.Edit', 'Users.Delete','Users.Create'],
        link: '/customers/list'
      },
      {
        key: 'Merchant.joinRequests',
        text: 'joinRequests',
        permission: ['joinRequests.View', 'joinRequests.Edit', 'joinRequests.Delete', 'joinRequests.Create'],

        link: '/merchents/joinRequests/list'
      },
      {
        key: 'SourceIntroduction.sourceIntroductionTypes',
        text: 'Source Introduction',
        permission: ['SourceIntroduction.View', 'SourceIntroduction.Edit', 'SourceIntroduction.Delete', 'SourceIntroduction.Create'],
        link: '/SourceIntroduction/list'
      },
      {
        icon: 'mdi-cash-check',
        key: 'menu.PriceCategories',
        text: 'PriceCategories',
        permission: ['PriceCategories.View', 'PriceCategories.Edit', 'PriceCategories.Delete', 'PriceCategories.Create'],
        link: '/PriceCategories/list'
      }

    ]
  },
  {
    icon: 'mdi-cog-outline',
    key: 'menu.setting',
    text: 'setting',
    permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create', 'Nationalities.View', 'Nationalities.Edit', 'Nationalities.Delete','Nationalities.Create'],
    regex: /^\/setting/,

    items: [
      {
        icon: 'mdi-view-carousel-outline',
        key: 'menu.carouselEdit',
        text: 'carousels',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/carousels'
      },
      {
        icon: 'mdi-credit-card-settings-outline',
        key: 'setting.payment',
        text: 'payment',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/payment-methods'
      },
      {
        icon: 'mdi-currency-usd',
        key: 'setting.tax',
        text: 'tax',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/tax'
      },
      {
        icon: 'mdi-comment-question-outline',
        key: 'setting.faq',
        text: 'FAQ',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/FAQ'
      },
      {
        icon: 'mdi-book-alert-outline',
        key: 'setting.privacyPolicy',
        text: 'privacy policy',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/privacy-policy'
      },
      {
        icon: 'mdi-book-alert',
        key: 'setting.termsAndConditions',
        text: 'terms and conditions',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/terms-and-conditions'
      },
      {
        icon: 'mdi-information',
        key: 'setting.aboutUs',
        text: 'aboutUs',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/about-us'
      },
      {
        icon: 'mdi-at',
        key: 'setting.media',
        text: 'socialMedia',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/setting/social-media'
      }

    ]
  },
  {
    icon: 'mdi-help',
    key: 'complaints.complaints',
    text: 'complaints',
    regex: /^\/complaints/,
    permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
    items: [
      {
        icon: 'mdi-help',
        key: 'complaints.complaintsPage',
        text: 'complaints page',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/complaints/complaints-page'
      }

    ]
  },
  {
    icon: 'mdi-page-layout-footer',
    key: 'footer.setting',
    text: 'footer',
    regex: /^\/footer/,
    permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
    items: [

      {
        icon: 'mdi-information',
        key: 'setting.shortAbout',
        text: 'aboutUs',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/footer-setting/short-about'
      },
      /*   {
        icon: 'mdi-information',
        key: 'setting.aboutUs',
        text: 'aboutUs',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/footer-setting/about-us'
      }, */
      {
        icon: 'mdi-at',
        key: 'setting.media',
        text: 'socialMedia',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/footer-setting/social-media'
      },
      {
        icon: 'mdi-at',
        key: 'setting.contact',
        text: 'contactInfo',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/footer-setting/contact-us'
      }
      /*    {
        icon: 'mdi-book-alert-outline',
        key: 'setting.privacyPolicy',
        text: 'privacy policy',
        permission: ['Settings.View', 'Settings.Edit', 'Settings.Delete', 'Settings.Create'],
        link: '/footer-setting/privacy-policy'
      },
     */

    ]
  }

]
/*permission: ["Locations.View", "Locations.Edit", "Locations.Delete", "Locations.Create"]  */
/* permission: ["brands.View", "brands.Edit", "brands.Delete","brands.Create"] Refrences */
/* permission: ["Refrences.View", "Refrences.Edit", "Refrences.Delete","Refrences.Create"]  */
