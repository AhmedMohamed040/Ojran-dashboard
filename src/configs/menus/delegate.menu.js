export default [
  {
    icon: 'mdi-format-list-checkbox',
    key: 'menu.todo',
    text: 'Todo',
    regex: /^\/Todo/,
    items: [
      {
        key: 'WorkPlan.Pending',
        text: 'Pending',
        link: '/WorkPlans/list/pending'
      },
      {
        key: 'WorkPlan.Accepted',
        text: 'Accepted',
        link: '/WorkPlans/list/accepted'
      },
      {
        key: 'WorkPlan.Declined',
        text: 'Declined',
        link: '/WorkPlans/list/declined'
      }
    ]
  },
  {
    icon: 'mdi-account-cash',
    key: 'menu.Merchants',
    text: 'Merchants',
    link: '/PotentialMerchants/list'
  },
  {
    icon: 'mdi-clipboard-list',
    key: 'menu.todoList',
    text: 'PotentialMerchantVisit',
    link: '/PotentialMerchantVisit/list'
  },

  {
    icon: 'mdi-store',
    key: 'menu.orders',
    text: 'orders',
    link: '/orders/list'
  }
]
