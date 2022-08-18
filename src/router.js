import vueRouter from 'vue-router'
import Login from './components/Login'
import App from './App'
import Home from './components/Home'
import Resumen from './components/Resumen'
import Registros from  './components/Registros'
import Metas from './components/Metas'
import Categorias from './components/Categorias'
import SingUp from './components/SingUp'
import Ingresos from './components/Ingresos'

const router = new vueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path:       '/',
            name:       "root",
            component:  App
        },
        {
            path:       '/Home',
            name:       "Home",
            component:   Home
        },
        {
            path:       '/user/create',
            name:       "SingUp",
            component:   SingUp
        },
        {
            path:       '/user/login/',
            name:       "Login",
            component:  Login
        },
        {
            path:       '/user/resumen/:username',
            name:       "Resumen",
            component:  Resumen
        },
        {
            path:       '/user/records/:username',
            name:       "Registros",
            component:  Registros
        },
        {
            path:       '/user/goals/track/:username',
            name:       "Metas",
            component:  Metas
        },
        {   path:       '/user/cats/:username',
            name:       "Categorias",
            component:  Categorias
        },
        {   path:       '/user/incomes/:username',
            name:       "Ingresos",
            component:  Ingresos
        }
    ]
})
export default router