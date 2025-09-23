import axios from "axios";

// CORRECTED: Read the API URL from Vite's environment variables,
// with a fallback to the correct local backend port.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: baseURL,
});

export default client;