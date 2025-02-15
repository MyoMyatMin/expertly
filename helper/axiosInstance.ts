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
      const response = await publicApi.post(
        "/signup",
        {
          email,
          password,
          name,
        },
        { withCredentials: true }
      );
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
      console.log("Moderator signed in", reponse.data);
      return reponse.data;
    },
    getPosts: async () => {
      const response = await publicApi.get("/posts");
      return response.data;
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
      console.log("Post updated", response.data);
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
    getFollowers: async (username: string) => {
      const response = await privateApi.get(`/users/${username}/followers`);
      return response.data;
    },
    getSavedPosts: async (username: string) => {
      const response = await privateApi.get(`/saved_posts/${username}`);
      console.log("Saved Posts", response.data);
      return response.data;
    },
    getLikedPosts: async () => {
      const response = await privateApi.get("/upvotes");
      return response.data;
    },
    getPostsForContributor: async (username: string) => {
      const response = await privateApi.get(`/profile/${username}/posts`);
      return response.data;
    },

    followUser: async (userid: string) => {
      const response = await privateApi.post(`/follow`, {
        following_id: userid,
      });
      return response.data;
    },

    unfollowUser: async (userid: string) => {
      console.log("Unfollowing user", userid);
      const response = await privateApi.delete(`/follow/${userid}`);
      return response.data;
    },

    updateUser: async (name: string, username: string) => {
      const response = await privateApi.put(`/profile/update`, {
        name: name,
        username: username,
      });
      return response.data;
    },

    // New function for liking a post
    likePost: async (postId: string) => {
      const response = await privateApi.post(`/posts/${postId}/upvotes`);
      return response.data;
    },

    // New function for unliking a post
    unlikePost: async (postId: string) => {
      const response = await privateApi.delete(`/posts/${postId}/upvotes`);
      return response.data;
    },

    // New function for saving a post
    savePost: async (postId: string) => {
      const response = await privateApi.post(`/saved_posts`, {
        post_id: postId,
      });
      return response.data;
    },

    // Function for unsaving a post (already exists, but renamed for consistency)
    unsavePost: async (postId: string) => {
      const response = await privateApi.delete(`/saved_posts/${postId}`);
      return response.data;
    },

    // New function for reporting a post
    reportPost: async (postId: string, reason: string, details: string) => {
      const response = await privateApi.post(`/reports`, {
        post_id: postId,
        reason: reason,
        details: details,
      });
      return response.data;
    },

    deletePost: async (slug: string) => {
      const response = await privateApi.delete(`/posts/${slug}`);
      console.log("Post deleted", response.data);
      return response.data;
    },

    getPostDetailsbySlug: async (slug: string) => {
      const response = await privateApi.get(`/posts/${slug}`);
      console.log("Post details", response.data);
      return response.data;
    },
    getPostCommentsBySlug: async (slug: string) => {
      const response = await privateApi.get(`/posts/${slug}/comments`);
      return response.data;
    },
    getContributorApplications: async () => {
      const response = await privateApi.get("/admin/contributor_applications");
      return response.data;
    },

    getContributorApplication: async (id: string) => {
      const response = await privateApi.get(
        `/admin/contributor_applications/${id}`
      );
      return response.data;
    },
    updateApplicationStatus: async (id: string, app_status: string) => {
      console.log(app_status);
      const response = await privateApi.put(
        `/admin/contributor_applications/${id}/status`,
        {
          app_status,
        }
      );
      console.log("Application status updated", response.data);
      return response.data;
    },
    getReportsForContributors: async () => {
      const response = await privateApi.get("/admin/contributors/reports");
      return response.data;
    },

    getReportsForUsers: async () => {
      const response = await privateApi.get("/admin/users/reports");
      return response.data;
    },

    updateReportStatus: async (reportID: string, status: string) => {
      const response = await privateApi.put(
        `/admin/reports/${reportID}/status`,
        { status }
      );
      return response.data;
    },

    getAppealsForContributors: async () => {
      const response = await privateApi.get("/admin/contributors/appeals");
      return response.data;
    },

    getAppealsForUsers: async () => {
      const response = await privateApi.get("/admin/users/appeals");
      console.log("User appeals", response.data);
      return response.data;
    },

    getAppealsByID: async (appealID: string) => {
      const response = await privateApi.get(`/admin/appeals/${appealID}`);
      return response.data;
    },

    updateAppealStatus: async (appealID: string, status: string) => {
      console.log("Updating appeal status", appealID, status);
      const response = await privateApi.put(
        `/admin/appeals/${appealID}/status`,
        { status }
      );
      return response.data;
    },

    createContributorApplication: async (data: {}) => {
      console.log("Creating contributor application", data);
      const response = await privateApi.post("/contributor_application", data);

      return response.data;
    },

    getFollowingFeed: async () => {
      const response = await privateApi.get("/feed");
      return response.data;
    },

    addComment: async (
      postId: string,
      content: string,
      replyCommentId: string
    ) => {
      console.log("Adding comment", postId, content, replyCommentId);
      const response = await privateApi.post(`/posts/${postId}/comments`, {
        content,
        replyCommentId: replyCommentId || null,
      });
      return response.data;
    },

    editComment: async (
      postId: string,
      commentId: string,
      newContent: string
    ) => {
      try {
        const response = await privateApi.patch(
          `/posts/${postId}/comments/${commentId}`,
          {
            content: newContent,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error details:", error);
        const axiosError = error as any;
        if (axiosError.response) {
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
        } else {
          console.error("Error message:", axiosError.message);
        }
      }
    },

    deleteComment: async (postId: string, commentId: string) => {
      const response = await privateApi.delete(
        `/posts/${postId}/comments/${commentId}`
      );
      return response;
    },
  },
};

export { publicApi, privateApi };
