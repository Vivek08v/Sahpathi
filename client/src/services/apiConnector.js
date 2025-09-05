import axios from "axios";
import store from "../redux/store"; 
import { setAuthenticated } from "../redux/slices/userSlice";
const API_URL = 'http://localhost:4000/api/v1';

export const axiosInstance = axios.create({ withCredentials: true });

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      // prevent infinite loop
      if (originalRequest.url.includes("/auth/refresh")) {
        store.dispatch(setAuthenticated(false));
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post(`${API_URL}/refresh`);
        // const newAccessToken = refreshResponse.data.accessToken;

        // attach new token if you’re using headers
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        // originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry
      } catch (refreshErr) {
        store.dispatch(setAuthenticated(false));
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export const apiConnector = (method, url, body, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: body ? body : null,
        headers: headers ? headers : null,
        params: params ? params : null
    })
}

