import axios from "axios";
import {getToken, SPARROW_TOKEN} from "./token";

const AJAX = "ajax";
const RESULT_OK_CODE = "0";

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    timeout: 3000,
    //session id 无法保存问题
    withCredentials: true
});

httpClient.interceptors.request.use(
    config => {
        const token = getToken();
        config.headers[AJAX] = true;
        if (token) {
            config.headers[SPARROW_TOKEN] = token;
        }
        return config;
    }, error => {
        console.log(error);
        return Promise.reject(error.message);
    });

httpClient.interceptors.response.use(
    response => {
        const res = response.data;
        if (!res.code) {
            return Promise.reject("can't found Result Wrap!");
        }
        if (res.code !== RESULT_OK_CODE) {
            //在调用侧直接try await结果即可
            return Promise.reject(res.message);
        }
        return Promise.resolve(res.data);
    },
    error => {
        console.log("error" + error);
        return Promise.reject(error.message);
    }
);

export default httpClient;