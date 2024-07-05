// src/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8001/api', // Your Laravel API base URL
  // You can add other axios configuration options here
});

export default instance;
