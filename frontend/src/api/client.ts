import axios from "axios";

let baseURL = "http://localhost:8082/api";

if (import.meta.env.PROD) {
  baseURL = "https://movie.linze.pro";
}

const client = axios.create({
  baseURL: baseURL,
});

export default client;
