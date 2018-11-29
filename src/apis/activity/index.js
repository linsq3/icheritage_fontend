import fetch from '../fetch';
import qs from 'qs'
export const getActivity = (params) => fetch({
    url: `/admin/activity/list`,
    data: params,
    method: 'get'
});

export const newActivity = (params) => fetch({
    url: `/admin/activity/new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editActivity = (params) => fetch({
    url: `/admin/activity/edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delActivity = (params) => fetch({
    url: `/admin/activity/del`,
    data: qs.stringify(params),
    method: 'post'
});
export const sortActivity = (params) => fetch({
    url: `/admin/activity/sort`,
    data: qs.stringify(params),
    method: 'post'
});
export const recoverActivity= (params) => fetch({
    url: `/admin/activity/recover`,
    data: qs.stringify(params),
    method: 'post'
});
export const viewActivity = (params) => fetch({
    url: `/admin/activity/view`,
    data: params,
    method: 'get'
});
export const getActivityTag = (params) => fetch({
    url: `/admin/activity/tag`,
    data: params,
    method: 'get'
});
export const getActivityDetail = (params) => fetch({
    url: `/admin/activity/edit/info`,
    data: params,
    method: 'get'
});