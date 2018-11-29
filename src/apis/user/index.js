import fetch from '../fetch';
import qs from 'qs'
export const getUser = (params) => fetch({
    url: `/admin/webuser/list`,
    data: params,
    method: 'get'
});

export const userAgree = (params) => fetch({
    url: `/admin/webuser/agree`,
    data: qs.stringify(params),
    method: 'post'
});
export const userRefused = (params) => fetch({
    url: `/admin/webuser/refused`,
    data: qs.stringify(params),
    method: 'post'
});

