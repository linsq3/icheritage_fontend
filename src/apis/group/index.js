import fetch from '../fetch';
import qs from 'qs'
export const getGroup = (params) => fetch({
    url: `/admin/group/list`,
    data: params,
    method: 'get'
});

export const newGroup = (params) => fetch({
    url: `/admin/group/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editGroup = (params) => fetch({
    url: `/admin/group/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delGroup = (params) => fetch({
    url: `/admin/group/del`,
    data: qs.stringify(params),
    method: 'post'
});
export const sortGroup = (params) => fetch({
    url: `/admin/group/sort`,
    data: qs.stringify(params),
    method: 'post'
});
export const recoverGroup = (params) => fetch({
    url: `/admin/group/recover`,
    data: qs.stringify(params),
    method: 'post'
});
export const agreeGroup = (params) => fetch({
    url: `/admin/group/agree`,
    data: qs.stringify(params),
    method: 'post'
});
export const viewGroup = (params) => fetch({
    url: `/admin/group/view`,
    data: params,
    method: 'get'
});