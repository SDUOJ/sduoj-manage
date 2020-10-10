// general
import NotFoundView from '@/views/404/404View';

// user
import UserView from '@/views/user/UserView';

// problem
import ProblemView from '@/views/problem/ProblemView';
import ProblemDetailView from '@/views/problem/ProblemDetailView';

const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { title: '用户' }
  },
  {
    path: '/problem',
    name: 'problem',
    component: ProblemView,
    meta: { title: '题库' }
  },
  {
    path: '/problem/:problemCode',
    name: 'problem-detail',
    component: ProblemDetailView
  },
  {
    path: '*',
    component: NotFoundView
  }
]

export default routes;