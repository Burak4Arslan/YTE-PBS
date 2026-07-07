import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    xsrfCookieName: 'xsrf-token',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

export default api;