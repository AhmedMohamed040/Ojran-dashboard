export default [
  {
    path: '/Workplan',
    redirect: 'Workplan/tasks '
  },
  {
    path: '/workplans',
    name: 'Workplan-tasks',
    component: () => import('../pages/Workplan/WorkPlanTasks.vue')
  },
  {
    path: '/workplans/:id/agents',
    name: 'Workplan-agents',
    component: () => import('../pages/Workplan/WorkPlanAgents.vue')
  },
  {
    path: '/workplans/:id/agents/:agentId',
    name: 'WorkplanAgentVisits',
    component: () => import('../pages/Workplan/WorkPlanAgentVisits.vue')
  },
  {
    path: '/workplan-types',
    name: 'workplan-types',
    component: () => import('../pages/Workplan/WorkPlanTypes.vue')
  }
]