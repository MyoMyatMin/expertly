import axios, { AxiosInstance } from "axios";
import { refreshToken } from "@/helper/apihelper";

// Create two axios instances
const publicApi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const privateApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add response interceptor only to privateApi
privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.error;
    if (errorMessage === "token is expired") {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return privateApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue();
        return privateApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  // Public endpoints that don't require authentication
  public: {
    // Authentication endpoints
    signin: async (email: string, password: string) => {
      const response = await publicApi.post(
        "/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // Need this to store cookies even though it's public endpoint
        }
      );
      return response.data;
    },

    signup: async (email: string, password: string, name: string) => {
      const response = await publicApi.post(
        "/signup",
        {
          email,
          password,
          name,
        },
        {
          withCredentials: true, // Need this to store cookies even though it's public endpoint
        }
      );
      return response.data;
    },

    // Other public endpoints
    getCategories: async () => {
      const response = await publicApi.get("/categories");
      return response.data;
    },

    search: async (query: string) => {
      const response = await publicApi.get(`/search?q=${query}`);
      return response.data;
    },
  },

  // Protected endpoints that require authentication
  protected: {
    // Auth-related actions that require existing authentication
    logout: async () => {
      const response = await privateApi.post("/logout");
      return response.data;
    },

    getMe: async () => {
      const response = await privateApi.get("/auth/me");
      return response.data;
    },

    // Other protected endpoints
    updateProfile: async (data: any) => {
      const response = await privateApi.put("/profile", data);
      return response.data;
    },

    getUserContent: async () => {
      const response = await privateApi.get("/user/content");
      return response.data;
    },

    createPost: async (data: any) => {
      const response = await privateApi.post("/posts", data);
      return response.data;
    },
  },
};

export { publicApi, privateApi };
