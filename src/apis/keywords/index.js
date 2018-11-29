import fetch from '../fetch';
import qs from 'qs'
export const getSearch = (params) => fetch({
    url: `/admin/search/list`,
    data: params,
    method: 'get'
});

export const newSearch = (params) => fetch({
    url: `/admin/search/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editSearch= (params) => fetch({
    url: `/admin/search/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delSearch = (params) => fetch({
    url: `/admin/search/del`,
    data: qs.stringify(params),
    method: 'post'
});
