// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue') },
    { path: '/discard', name: 'Discard', component: () => import('../components/Discard.vue') },
    { path: '/pure-ones-tenpai', name: 'PureOnesTenpai', component: () => import('../components/PureOnesTenpai.vue') },
    { path: '/efficiency-train', name: 'EfficiencyTrain', component: () => import('../components/EfficiencyTrain.vue') },
    { path: '/point-calculation', name: 'PointCalculation', component: () => import('../components/PointCalculation.vue') },
    { path: '/hand-point-calculation', name: 'HandPointCalculation', component: () => import('../components/HandPointCalculation.vue') },
    { path: '/hand-point-calculator', name: 'HandPointCalculator', component: () => import('../components/HandPointCalculator.vue') },
    { path: '/guide', name: 'Guide', component: () => import('../components/Guide.vue') },
    { path: '/basic-terms', name: 'BasicTerms', component: () => import('../components/BasicTerms.vue') },
    { path: '/books', name: 'Books', component: () => import('../components/Books.vue') },
    { path: '/introduce', name: 'Introduce', component: () => import('../components/Introduce.vue') },
    { path: '/web-dictionary', name: 'WebDictionary', component: () => import('../components/WebDictionary.vue') },
    { path: '/review', name: 'Review', component: () => import('../components/Review.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router