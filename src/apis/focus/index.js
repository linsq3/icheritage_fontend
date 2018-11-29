import fetch from '../fetch';
import qs from 'qs'
export const getFocus = (params) => fetch({
    url: `/admin/focus/`,
    data: params,
    method: 'get'
});

export const newFocus = (params) => fetch({
    url: `/admin/focus/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editFocus = (params) => fetch({
    url: `/admin/focus/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delFocus = (params) => fetch({
    url: `/admin/focus/del`,
    data: qs.stringify(params),
    method: 'post'
});
export const sortFocus = (params) => fetch({
    url: `/admin/focus/sort`,
    data: qs.stringify(params),
    method: 'post'
});
export const recoverFocus = (params) => fetch({
    url: `/admin/focus/recover`,
    data: qs.stringify(params),
    method: 'post'
});