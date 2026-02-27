import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://jobportalsystem-4fu4.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

export default publicApi;
