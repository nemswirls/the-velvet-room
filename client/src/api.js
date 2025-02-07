import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555/', // Your Flask server URL
  withCredentials: true, // Include credentials for cross-origin requests if needed
});

export { api }; // Named export