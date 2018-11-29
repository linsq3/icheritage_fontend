import fetch from '../fetch';
import qs from 'qs'
export const login = (params) => fetch(
    {
        url: `/login`,
        data: qs.stringify(params),
        method: 'post'
    }
);
export const logout = (params) => fetch(
    {
        url: `/logout`,
        data: qs.stringify(params),
        method: 'post'
    }
);
