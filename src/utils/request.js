/*
* @Author: 王侃
* @Date:   2019-07-19 15:56:41
* @Description: '请求封装'
*/
import axios from 'axios'; // axios
import { common } from './common.js'; // common

export default {
    // get请求
    get: async(url, param, isThird) => {
        let newTime = new Date().getTime().toString() + Math.floor(Math.random()*100).toString();
        url = isThird ? isThird + url : process.env.BASE_API + url;
        if (param) {
            url += '?' + common.serialize(param);
        }
        let rconfig = {
            credentials: 'include',
            method: 'GET',
            headers: {
                'newTime': newTime,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': common.getToken(),
            },
            mode: 'cors',
            cache: 'force-cache',
        };
        const response = await axios.get(url, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    // post请求
    post: async(url, data = {}, isThird) => {
        let newTime = new Date().getTime().toString() + Math.floor(Math.random()*100).toString();
        url = isThird ? isThird + url : process.env.BASE_API + url;
        let rconfig = {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'newTime': newTime,
                'token': common.getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'force-cache'
        };
        const response = await axios.post(url, data, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    // put请求
    put: async(url, data = {}, isThird) => {
        let newTime = new Date().getTime().toString() + Math.floor(Math.random()*100).toString();
        url = isThird ? isThird + url : process.env.BASE_API + url;
        let rconfig = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'token': common.getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const response = await axios.put(url, data, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    // delete请求
    delete: async(url, data = {}, isThird) => {
        let newTime = new Date().getTime().toString() + Math.floor(Math.random()*100).toString();
        url = isThird ? isThird + url : process.env.BASE_API + url;
        let rconfig = {
            credentials: 'include',
            method: 'DELETE',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'token': common.getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'force-cache'
        };
        const response = await axios.delete(url, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    }
};

// 响应拦截
axios.interceptors.response.use(function(response) {
    return response;
}, function(err) {
    console.error(err);
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误(400)';
                break;
            case 401:
                err.message = '登录失效，请重新登录(401)';
                router.push('/login');
                break;
            case 403:
                err.message = '拒绝访问(403)';
                break;
            case 404:
                err.message = '请求出错(404)';
                break;
            case 408:
                err.message = '请求超时(408)';
                break;
            case 500:
                err.message = '服务器错误(500)';
                break;
            case 501:
                err.message = '服务未实现(501)';
                break;
            case 502:
                err.message = '网络错误(502)';
                break;
            case 503:
                err.message = '服务不可用(503)';
                break;
            case 504:
                err.message = '网络超时(504)';
                break;
            case 505:
                err.message = 'HTTP版本不受支持(505)';
                break;
            default:
                err.message = `连接出错(${err.response.status})!`;
        }
    } else {
        console.log('error:',err);
        err.message = '连接服务器失败!'
    }
    return Promise.reject(err);
});
