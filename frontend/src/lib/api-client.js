import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "https://naturesnationalindia.onrender.com",
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    error.message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(error);
  },
);

export default apiClient;
