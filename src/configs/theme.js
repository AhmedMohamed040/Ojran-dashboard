export default {
  // global theme for the app
  globalTheme: 'light', // light | dark

  // side menu theme, use global theme or custom
  menuTheme: 'global', // global | light | dark

  // toolbar theme, use global theme or custom
  toolbarTheme: 'global', // global | light | dark

  // show toolbar detached from top
  isToolbarDetached: false,

  // wrap pages content with a max-width
  isContentBoxed: false,

  // application is right to left
  isRTL: localStorage.getItem('isRTL')
    ? localStorage.getItem('isRTL') === 'true'
      ? true
      : false
    : true,
  // dark theme colors
  dark: {
    background: '#000000',
    surface: '#111b27',
    primary: '#0096c7',
    secondary: '#829099',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },

  // light theme colors
  light: {
    background: '#ffffff',
    surface: '#f2f5f8',
    primary: '#0096c7',
    secondary: '#a0b9c8',
    accent: '#048ba8',
    error: '#ef476f',
    info: '#2196F3',
    success: '#06d6a0',
    warning: '#ffd166',
    Accepted: '#06d6a0',
    Pending: '#BF360C',
    Prepared: '#009688',
    Delivered: '#4CAF50',
    Rejected: '#D32F2F',
    Canceled: '#CDDC39'
  }
}
