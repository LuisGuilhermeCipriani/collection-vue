import { createRouter, createWebHistory } from "vue-router";

import Cadastrar from '../pages/cadastrar/Cadastrar';
import Exibir from '../pages/exibir/Exibir.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Cadastrar
        },
        {
            path: '/exibir',
            component: Exibir
        }
    ]
})

export default router;