import {
    Message
} from 'element-ui';
import axios from 'axios'
// import router from '@/router/router';
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? '/' : 'http://beastsclub.cn/icheritage/web/app_dev.php/';
const fetch = (options) => {
    if ((options.method).toUpperCase() === 'GET') {
        options.params = options.data;
    }
    return axios({
        ...options,
        baseURL
    }).then(res => {
        if (res.data && res.data.code == 0) {
            return res.data;
        } else if (res.data.code === 5005) {
            Message.error(res.data.msg);
            window.location.href = "/#/login";
        } else {
            Message.error(res.data.msg);
            return Promise.reject(res.data);
        }
    });
}

export default fetch;