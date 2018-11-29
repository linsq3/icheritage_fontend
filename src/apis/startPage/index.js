import fetch from '../fetch';
import qs from 'qs'
export const getStartPage = (params) => fetch({
    url: `/admin/startpage/list`,
    data: params,
    method: 'get'
});

export const newStartPage = (params) => fetch({
    url: `/admin/startpage/startpage_new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editStartPage = (params) => fetch({
    url: `/admin/startpage/startpage_update`,
    data: qs.stringify(params),
    method: 'post'
});

export const shelveStartPage = (params) => fetch({
    url: `/admin/startpage/shelve`,
    data: qs.stringify(params),
    method: 'post'
});
export const offshelveStartPage = (params) => fetch({
    url: `/admin/startpage/offshelve`,
    data: qs.stringify(params),
    method: 'post'
});
export const getStartImg = (params) => fetch({
    url: `/admin/startpage/startpage_imglist`,
    data: params,
    method: 'get'
});
export const newStartImg = (params) => fetch({
    url: `/admin/startpage/startpage_img_new`,
    data: qs.stringify(params),
    method: 'post'
});
export const editStartImg = (params) => fetch({
    url: `/admin/startpage/startpage_img_edit`,
    data: qs.stringify(params),
    method: 'post'
});
export const delStartImg = (params) => fetch({
    url: `/admin/startpage/startpage_img_del`,
    data: qs.stringify(params),
    method: 'post'
});
