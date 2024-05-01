export default [
  {
    path: '/complaints',
    redirect: 'complaints'
  },
  {
    path: '/complaints/complaints-page',
    name: 'complaints',
    component: () =>
      import(
        /* webpackChunkName: "complaints" */ '@/pages/complaints/ComplaintsPage.vue'
      )
  },
  {

    path: '/complaints/complaints-page/:complaintId',
    name: 'complaint-details',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "complaint-details" */ '@/pages/complaints/ComplaintDetails.vue'
      )

  }

]
