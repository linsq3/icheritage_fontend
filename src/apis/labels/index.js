import fetch from '../fetch';
import qs from 'qs'
export const getTag = (params) => fetch({
    url: `/admin/tag/list`,
    data: params,
    method: 'get'
});

export const newTag = (params) => fetch({
    url: `/admin/tag/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editTag= (params) => fetch({
    url: `/admin/tag/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delTag = (params) => fetch({
    url: `/admin/tag/del`,
    data: qs.stringify(params),
    method: 'post'
});
