import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Your Flask server URL
  withCredentials: true, // Include credentials for cross-origin requests if needed
});

export { api }; // Named export