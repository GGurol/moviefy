import axios from "axios";

let baseURL = "http://localhost:8082/api";

if (import.meta.env.PROD) {
  baseURL = "https://movie.linze.pro/api";
}

const client = axios.create({
  baseURL: baseURL,
});

export default client;
