
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('pages/Index.vue'),
    exact: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('pages/Overview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('pages/Logout.vue'),
    meta: {
      requiresAuth: false
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    meta: {
      requiresAuth: false
    }
  }
]

export default routes
