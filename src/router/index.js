import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import('@/layouts/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/ViewHome.vue')
      },
      {
        path: 'problem',
        component: () => import('@/views/problem/ViewProblem.vue'),
      },
      {
        path: 'problem/add',
        component: () => import('@/views/problem/AddProblem.vue')
      },
      {
        path: 'problem/:pid/checkpoint',
        name: 'checkpoint',
        component: () => import('@/views/problem/ViewCheckpoint.vue')
      },
      {
        path: 'problem/:pid',
        component: () => import('@/views/problem/EditProblem.vue')
      },
      {
        path: "/contest",
        name: "contest",
        component: () => import("@/views/ViewContest.vue")
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/ViewUser.vue")
      },
      {
        path: "/system",
        name: "system",
        component: () => import("@/views/ViewSystem.vue")
      },
      {
        path: "*",
        name: "404",
        component: () => import("@/views/View404.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
