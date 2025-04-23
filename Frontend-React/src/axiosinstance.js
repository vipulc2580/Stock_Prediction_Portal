import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": 'application/json',
    }
})

// request Inceptors
axiosInstance.interceptors.request.use(function (config) {
    // console.log('before auth headers request=>', config);
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    // console.log('after request with auth headers=>', config);
    // from here it will go to server
    return config;
}, function (error) {
    return Promise.reject(error);
});

// response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async function (error) {
        const originalRequest = error.config;

        // Check for 401 and that we haven’t retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('token/refresh/', { refresh: refreshToken });

                    const newAccessToken = response.data.access;
                    // console.log(`New access Token: ${newAccessToken}`);
                    localStorage.setItem('accessToken', newAccessToken);

                    // Attach the new access token to the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Clear tokens and redirect to login if refresh fails
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login/';
                }
            }
        }

        // If it's not a 401 or refresh fails, reject the original error
        return Promise.reject(error);
    }
);

export default axiosInstance