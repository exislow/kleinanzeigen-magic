
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('pages/Index.vue'),
    exact: true
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('pages/Overview.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('pages/Logout.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
