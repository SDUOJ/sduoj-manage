// general
import NotFoundView from '@/views/404/404View';

// user
import UserView from '@/views/user/UserView';

// problem
import ProblemView from '@/views/problem/ProblemView';
import ProblemDetailView from '@/views/problem/ProblemDetailView';
import ProblemDescriptionView from '@/views/problem/ProblemDescriptionView';
import ProblemCheckpointView from '@/views/problem/ProblemCheckpointView';


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
    redirect: '/problem/:problemCode/description',
    component: ProblemDetailView,
    children: [
      {
        path: 'description',
        name: 'problem-description',
        component: ProblemDescriptionView
      },
      {
        path: 'checkpoint',
        name: 'problem-checkpoint',
        component: ProblemCheckpointView
      }
    ]
  },
  {
    path: '*',
    component: NotFoundView
  }
]

export default routes;