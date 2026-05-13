import Axios from "axios";
import { Message } from "element-ui"
import EventBus from "./EventBus";
import index from '../store/index'

const API = {
    has(key, is_super_user = false) {
        let user = index.getters.currentUser ? index.getters.currentUser : false;
        if (!user) return false;
        if (is_super_user && !user.is_super_user) {
            return false;
        } else {
            let check = false;
            user.permits.forEach(item => {
                if (item.key === key) check = true;
            });
            return check;
        }
    },
    isset(variable) {
        if (typeof (variable) === 'undefined') {
            return false
        }
        if (variable === null) {
            return false
        }
        return false
    },
    isempty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    },
    login(data = null, callback = (data) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: true,
            type: 'POST',
            url: 'login',
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },
    logout(callback = (data) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'GET',
            url: 'logout',
            data: {},
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },
    get(url, data = null, callback = (data) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'GET',
            url: url,
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },
    post(url, data = null, callback = (data, errors) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'POST',
            url: url,
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },

    put(url, data = null, callback = (data, errors) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'PUT',
            url: url,
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },

    delete(url, data = null, callback = (data, errors) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'DELETE',
            url: url,
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },

    patch(url, data = null, callback = (data, errors) => {
    }, callbackErrors = (errors) => {
    }) {
        this.create({
            customUrl: false,
            type: 'PATCH',
            url: url,
            data: data,
            callback: callback,
            callbackErrors: callbackErrors,
        })
    },

    create(props) {
        let data = null;
        let getData = null;

        if (props.type === 'GET') {
            getData = props.data
        } else {
            data = props.data
        }

        let user = {
            api_token: null,
            customer: {
                key: null
            }
        };

        user = index.getters.currentUser ? index.getters.currentUser : user;

        let token = user.api_token;
        let url = props.customUrl ? process.env.VUE_APP_API_ENDPOINT + props.url : process.env.VUE_APP_API_ENDPOINT + user.customer.key + "/" + props.url;

        Axios({
            method: props.type,
            mode: 'no-cors',
            url: url,
            data: data,
            params: getData,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            props.callback(response);
        }).catch(error => {

            if (error.response) {
                if (error.response.status === 422) {
                    //Test
                    EventBus.$emit('apiWarning', error.response.data.errors);
                } else if (error.response.status === 401) {
                    console.log("401", error, user);
                    EventBus.$emit('logout', 'Oturum süreniz doldu, lütfen tekrar giriş yapın.');
                } else if (error.response.status === 403) {
                    Message.error(error.response.data.errors.message)
                } else if (error.response.status === 429) {
                    Message.warning('Çok fazla istek gönderdiniz. Birkaç saniye sonra tekrar deneyin.')
                }
                /*else if (error.response.status === 409) {
                    Message.warning('Ulaşmaya çalıştığınız istek sistemde yer almıyor.')
                }*/
                /*else if (error.response.status === 404) {
                    Message.warning('Ulaşmaya çalıştığınız istek sistemde yer almıyor.')
                } */
                else if (error.response.status === 500) {
                    Message.error(error.response.data.errors.message);
                } else if (error.response.status === 503) {
                    Message.error('Çok fazla hatalı istekte bulunduğunuz için oturumunuz engellendi.')
                } else {
                    try {
                        Message.error(error.response.data.errors.message)
                    } catch (e) {
                        EventBus.$emit('apiError', error.response.data);
                    }
                }
                props.callbackErrors(error.response.status, error.response.data.errors);
            } else if (error.request) {
                Message.error('Ulaşmak istediğiniz sayfa yanıt vermiyor, oturumunuz engellenmiş ya da böyle bir sayfa sunucuda barınmıyor olabilir.')
                props.callbackErrors(0, []);
            } /*else {
                console.log(error);
                Message.error('Bilinmeyen bir sorunla karşılaşıldı.')
                props.callbackErrors(0, []);
            }*/
        });

    }
}

export default API
