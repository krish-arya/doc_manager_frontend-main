// src/api/authAxios.js
import axios from 'axios';

// Authentication endpoint (AWS) - configured separately from main API
const authBaseURL = process.env.REACT_APP_AUTH_BASE_URL || 'https://9cke69xy4m.execute-api.ap-south-1.amazonaws.com/dev/api';

const authInstance = axios.create({
    baseURL: authBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default authInstance;
