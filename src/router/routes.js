// general
import NotFoundView from '@/views/404View';

// user
import UserView from '@/views/user/UserView';

// problem
import ProblemView from '@/views/problem/ProblemView';
import ProblemDetailView from '@/views/problem/ProblemDetailView';

// submission
import SubmissionView from '@/views/submission/SubmissionView';
import SubmissionDetailView from '@/views/submission/SubmissionDetailView';

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
  // {
  //   path: '/problem',
  //   name: 'problem',
  //   component: ProblemView,
  //   meta: { title: '题库' }
  // },
  // {
  //   path: '/problem/:id',
  //   component: ProblemDetailView
  // },
  // {
  //   path: '/submission',
  //   component: SubmissionView
  // },
  // {
  //   path: '/submission/:submissionId',
  //   component: SubmissionDetailView
  // },
  {
    path: '*',
    component: NotFoundView
  }
]

export default routes;