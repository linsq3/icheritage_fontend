import fetch from '../fetch';
import qs from 'qs'
export const getAccount = (params) => fetch({
    url: `/admin/user/`,
    data: params,
    method: 'get'
});

export const newAccount = (params) => fetch({
    url: `/admin/user/register`,
    data: qs.stringify(params),
    method: 'post'
});
export const editAccount = (params) => fetch({
    url: `/admin/user/user_update`,
    data: qs.stringify(params),
    method: 'post'
});
export const unlockAccount = (params) => fetch({
    url: `/admin/user/unlock`,
    data: qs.stringify(params),
    method: 'post'
});
export const lockAccount = (params) => fetch({
    url: `/admin/user/lock`,
    data: qs.stringify(params),
    method: 'post'
});
export const changePassword = (params) => fetch({
    url: `/admin/user/changepwd`,
    data: qs.stringify(params),
    method: 'post'
});
export const resetPwd = (params) => fetch({
    url: `/admin/user/resetPwd`,
    data: qs.stringify(params),
    method: 'post'
});
