import menuApps from './menus/apps.menu'
import menuDelegate from './menus/delegate.menu'

export default {
  // main navigation - side menu
  menu: [
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-view-dashboard-outline',
          key: 'menu.dashboard',
          text: 'Dashboard',
          link: '/dashboard/analytics'
        }
      ]
    },
    {
      text: '',
      items: localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'Manager' ? menuApps : []
    },
    {
      text: '',
      items: localStorage.getItem('role') === 'Agent' ? menuDelegate : []
    }
  ]
}
