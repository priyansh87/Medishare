import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Replace with your backend API URL
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`, // Attach token if it's in localStorage
    },
    withCredentials: true, // Ensure credentials (cookies) are sent with the request
});

export default axiosInstance;
