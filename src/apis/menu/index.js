import fetch from '../fetch';
import qs from 'qs'
export const getMenu = (params) => fetch({
    url: `/admin/menu/list`,
    data: params,
    method: 'get'
});

export const newMenu = (params) => fetch({
    url: `/admin/menu/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editMenu = (params) => fetch({
    url: `/admin/menu/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delMenu = (params) => fetch({
    url: `/admin/menu/del`,
    data: qs.stringify(params),
    method: 'post'
});
