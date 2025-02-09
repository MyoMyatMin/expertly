import axios from "axios";
import { refreshToken } from "@/helper/apihelper";

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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.error;

    if (
      errorMessage !== "token is expired" ||
      originalRequest.url === "/refresh-token"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      console.log("Refreshing token, adding to queue");
      try {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        return privateApi(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

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
);

export const api = {
  public: {
    signin: async (email: string, password: string) => {
      const response = await publicApi.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    signup: async (email: string, password: string, name: string) => {
      const response = await publicApi.post("/signup", {
        email,
        password,
        name,
      });
      return response.data;
    },
    moderatorSigin: async (email: string, password: string) => {
      const reponse = await publicApi.post(
        "/admin/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      return reponse.data;
    },
  },
  protected: {
    getMe: async () => {
      try {
        const response = await privateApi.get("/auth/me");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return { user: null };
        }
        throw error;
      }
    },
    logout: async () => {
      await privateApi.post("/logout");
    },
    createPost: async (data: {
      title: string;
      content: string;
      images: string[];
    }) => {
      const response = await privateApi.post("/posts", data);
      return response.data;
    },
    updatePost: async (data: {
      id: string;
      title: string;
      content: string;
      images: string[];
    }) => {
      const response = await privateApi.put(`/posts/${data.id}`, data);
      return response.data;
    },

    getProfileData: async (username: string) => {
      const response = await privateApi.get(`/profile/${username}`);
      return response.data;
    },

    getFollowings: async (username: string) => {
      const response = await privateApi.get(`/users/${username}/following`);
      console.log("Following list", response.data);
      return response.data;
    },
    getSavedPosts: async (username: string) => {
      const response = await privateApi.get(`/saved_posts/${username}`);
      console.log("Saved Posts", response.data);
      return response.data;
    },
    getPostsForContributor: async (username: string) => {
      const response = await privateApi.get(`/profile/${username}/posts`);
      return response.data;
    },

    followUser: async (username: string) => {
      const response = await privateApi.post(`/users/${username}/follow`);
      return response.data;
    },

    unfollowUser: async (userid: string) => {
      const response = await privateApi.delete(`/follow/${userid}`);
      return response.data;
    },

    unsavedPost: async (postId: string) => {
      const response = await privateApi.delete(`/saved_posts/${postId}`);
    },
  },
};

export { publicApi, privateApi };
