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
    component: () => import('@/views/newproblem/ProblemView'),
    meta: { title: '题库' }
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
