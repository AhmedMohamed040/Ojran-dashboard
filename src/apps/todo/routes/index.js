export default [{
  path: '',
  redirect: 'tasks'
}, {
  path: 'tasks',
  name: 'apps-todo-tasks',
  component: () => import(/* webpackChunkName: "apps-todo-tasks" */ '@/apps/todo/pages/WorkPlan.vue')
}, {
  path: 'types',
  name: 'apps-todo-types',
  component: () => import(/* webpackChunkName: "apps-todo-completed" */ '@/apps/todo/pages/WorkPlanTypes.vue')
},]
