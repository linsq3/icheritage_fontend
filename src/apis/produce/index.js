import fetch from '../fetch';
import qs from 'qs'
export const getProduceMenu = (params) => fetch({
    url: `/admin/produce/menu`,
    data: params,
    method: 'get'
});
export const getProduce = (params) => fetch({
    url: `/admin/produce/list`,
    data: params,
    method: 'get'
});
export const delProduce = (params) => fetch({
    url: `/admin/produce/del`,
    data: params,
    method: 'post'
});
export const newProduce = (params) => fetch({
    url: `/admin/produce/new`,
    data: params,
    method: 'post'
});
export const editProduce = (params) => fetch({
    url: `/admin/produce/edit`,
    data: params,
    method: 'post'
});
export const editInfoProduce = (params) => fetch({
    url: `/admin/produce/edit/info`,
    data: params,
    method: 'get'
});
export const sortProduce = (params) => fetch({
    url: `/admin/produce/sort`,
    data: params,
    method: 'post'
});
export const recoverProduce = (params) => fetch({
    url: `/admin/produce/recover`,
    data: params,
    method: 'post'
});
export const getState = (params) => fetch({
    url: `/admin/activity/state`,
    data: params,
    method: 'get'
});

