import axios, { AxiosRequestConfig } from 'axios';
import { UserState } from '../store/reducers/user';
export const DOMAIN = 'api.getwonderapp.com';
export const BASE_URL = 'https://' + DOMAIN;
export const API_PATH = '/v1';
export const CABLE_PATH = '/cable';

export const HTTP_DOMAIN = 'http://getwonderapp.com';

// fallback image for avatar
export const fallbackImageUrl = `https://wonderapp.imgix.net/female-silhouette.jpg?fit=fill`;

const wonderApi = axios.create({
  baseURL: BASE_URL + API_PATH,
  //   timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const api = (opts: AxiosRequestConfig, userState?: UserState) => {
  if (userState && userState.auth && userState.auth.token) {
    opts.headers = {
      ...opts.headers,
      Authorization: `Bearer ${userState.auth.token}`
    };
  }

  return wonderApi(opts);
};

export { wonderApi as ApiConfig };
export default api;
