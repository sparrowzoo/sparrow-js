import axios from 'axios'
import { Toast } from 'vant';

import store from "../store"
const mainAxios = axios.create()
mainAxios.defaults.baseURL = 'http://studyapi.zhilongsoft.com'
mainAxios.interceptors.request.use(config => {
    config.headers['X-Sugar-Token'] = store.state.token
    return config
}, err => { return Promise.reject(err) });
mainAxios.interceptors.response.use(({ data: { data, code, msg } }) => {
    if (code === 200) {
        return Promise.resolve(data)
    } else {
        Toast.fail(msg);
        throw Promise.reject(msg)
    }
}, err => { return Promise.reject(err) });

export default mainAxios;