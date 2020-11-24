/*
 * Copyright 2020-2020 the original author or authors.
 *
 * Licensed under the General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 */

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
