import fetch from '../fetch';
import qs from 'qs'
export const getComments = (params) => fetch({
    url: `/admin/comment/list`,
    data: params,
    method: 'get'
});

export const commentsAgree = (params) => fetch({
    url: `/admin/comment/agree`,
    data: qs.stringify(params),
    method: 'post'
});
export const commentsRefused = (params) => fetch({
    url: `/admin/comment/refused`,
    data: qs.stringify(params),
    method: 'post'
});

