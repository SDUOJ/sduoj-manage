const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/UserView'),
    meta: { title: '用户' }
  },
  {
    path: '/problem',
    name: 'problem',
    component: () => import('@/views/problem/ProblemView'),
    meta: { title: '题库' }
  },
  {
    path: '/problem/:problemCode',
    name: 'problem-detail',
    redirect: '/problem/:problemCode/description',
    component: () => import('@/views/problem/ProblemDetailView'),
    children: [
      {
        path: 'description',
        name: 'problem-description',
        component: () => import('@/views/problem/ProblemDescriptionView')
      },
      {
        path: 'checkpoint',
        name: 'problem-checkpoint',
        component: () => import('@/views/problem/ProblemCheckpointView')
      }
    ]
  },
  {
    path: '/contest',
    name: 'contest',
    component: () => import('@/views/contest/ContestView')
  },
  {
    path: '/template',
    name: 'template',
    component: () => import('@/views/template/JudgeTemplateView')
  },
  {
    path: '*',
    component: () => import('@/views/404/404View')
  }
]

export default routes;
