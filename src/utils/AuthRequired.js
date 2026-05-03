import {isAuthActive} from '../constans/config'

export default (to, from, next) => {
    if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.password_change_required) {
            next('/change-password');
        } else {
            next();
        }
    } else {
        localStorage.removeItem('user')
        next('/login')
    }
}