// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue') },
    { path: '/discard', name: 'Discard', component: () => import('../components/Discard.vue') },
    { path: '/three-hundred/:id?', name: 'ThreeHundred', component: () => import('../components/ThreeHundred.vue') },
    { path: '/pure-ones-tenpai', name: 'PureOnesTenpai', component: () => import('../components/PureOnesTenpai.vue') },
    { path: '/point-calculation', name: 'PointCalculation', component: () => import('../components/PointCalculation.vue') },
    { path: '/guide', name: 'Guide', component: () => import('../components/Guide.vue') },
    { path: '/books', name: 'Books', component: () => import('../components/Books.vue') },
    { path: '/contact', name: 'Contact', component: () => import('../components/Contact.vue') },
    { path: '/introduce', name: 'Introduce', component: () => import('../components/Introduce.vue') },
    { path: '/web-dictionary', name: 'WebDictionary', component: () => import('../components/WebDictionary.vue') },
    { path: '/review', name: 'Review', component: () => import('../components/Review.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router