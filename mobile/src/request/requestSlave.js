import axios from 'axios'
const slaveAxios = axios.create()
slaveAxios.defaults.baseURL = 'http://chat.sparrowzoo.com'
slaveAxios.interceptors.response.use(({ data: { data, code, msg } }) => {
    return Promise.resolve(data)
}, err => { });

export default slaveAxios;