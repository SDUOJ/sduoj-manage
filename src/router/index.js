import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/ViewHome.vue")
  },
  {
    path: "/problem",
    name: "problem",
    component: () => import("@/views/ViewProblem.vue"),
    children: [
      {
        path: "add",

      }
    ]
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
];

const router = new VueRouter({
  routes
});

export default router;
