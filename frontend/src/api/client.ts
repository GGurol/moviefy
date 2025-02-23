import axios from "axios";

// remember to change the baseURL when you deploy your app
// The Axios Instance
// https://axios-http.com/docs/instance

const client = axios.create({
  // baseURL: '/api',
  baseURL: "http://localhost:8080/api",
  // baseURL: import.meta.env.VITE_BASE_URL,
});

export default client;
