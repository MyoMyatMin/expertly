// axiosinstance.tsx
import axios from "axios";
import { refreshToken } from "@/helper/apihelper";

const publicApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const privateApi = axios.create({
  baseURL: "http://localhost:8000/api",
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

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.error;

    if (
      errorMessage !== "token is expired" ||
      originalRequest.url === "/auth/refresh-token"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
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
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    signup: async (email: string, password: string, name: string) => {
      const response = await publicApi.post(
        "/auth/signup",
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
      const response = await publicApi.post(
        "/admin/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      return response.data;
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
      await privateApi.post("/auth/logout");
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
      return response.data;
    },
    getFollowers: async (username: string) => {
      const response = await privateApi.get(`/users/${username}/followers`);
      return response.data;
    },
    getSavedPosts: async (username: string) => {
      const response = await privateApi.get(`/saved-posts/${username}`);
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
    likePost: async (postId: string) => {
      const response = await privateApi.post(`/posts/${postId}/upvotes`);
      return response.data;
    },
    unlikePost: async (postId: string) => {
      const response = await privateApi.delete(`/posts/${postId}/upvotes`);
      return response.data;
    },
    savePost: async (postId: string) => {
      const response = await privateApi.post(`/saved-posts`, {
        post_id: postId,
      });
      return response.data;
    },
    unsavePost: async (postId: string) => {
      const response = await privateApi.delete(`/saved-posts/${postId}`);
      return response.data;
    },
    reportPost: async (postId: string, reason: string, commentId?: string) => {
      const response = await privateApi.post(`/reports`, {
        reason: reason,
        target_postID: postId,
        target_CommentID: commentId || null,
      });
      return response.data;
    },
    deletePost: async (slug: string) => {
      const response = await privateApi.delete(`/posts/${slug}`);
      return response.data;
    },
    getPostDetailsbySlug: async (slug: string) => {
      const response = await privateApi.get(`/posts/${slug}`);
      return response.data;
    },
    getPostCommentsBySlug: async (slug: string) => {
      const response = await privateApi.get(`/posts/${slug}/comments`);
      return response.data;
    },
    getContributorApplications: async () => {
      const response = await privateApi.get("/admin/contributor-applications");
      return response.data;
    },
    getContributorApplication: async (id: string) => {
      const response = await privateApi.get(
        `/admin/contributor-applications/${id}`
      );
      return response.data;
    },
    updateApplicationStatus: async (id: string, app_status: string) => {
      const response = await privateApi.put(
        `/admin/contributor-applications/${id}/status`,
        {
          app_status,
        }
      );
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
    updateReportStatus: async (
      reportID: string,
      status: string,
      suspendedDays: number,
      targetUserID: string
    ) => {
      const response = await privateApi.put(
        `/admin/reports/${reportID}/status`,
        { status, suspendedDays, targetUserID }
      );
      return response.data;
    },
    getAppealsForContributors: async () => {
      const response = await privateApi.get("/admin/contributors/appeals");
      return response.data;
    },
    getAppealsForUsers: async () => {
      const response = await privateApi.get("/admin/users/appeals");
      return response.data;
    },
    getAppealsByID: async (appealID: string) => {
      const response = await privateApi.get(`/admin/appeals/${appealID}`);
      return response.data;
    },
    updateAppealStatus: async (appealID: string, status: string) => {
      const response = await privateApi.put(
        `/admin/appeals/${appealID}/status`,
        { status }
      );
      return response.data;
    },
    createContributorApplication: async (data: {}) => {
      const response = await privateApi.post("/contributor-applications", data);
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
      const response = await privateApi.patch(
        `/posts/${postId}/comments/${commentId}`,
        {
          content: newContent,
        }
      );
      return response.data;
    },
    deleteComment: async (postId: string, commentId: string) => {
      const response = await privateApi.delete(
        `/posts/${postId}/comments/${commentId}`
      );
      return response;
    },
    getSuspendedReportsByUserID: async () => {
      const response = await privateApi.get(`/profile/reports`);
      return response.data;
    },
    createAppeal: async (reason: string, target_reportID: string) => {
      const response = await privateApi.post(`/appeals`, {
        reason,
        target_reportID,
      });
      return response.data;
    },
    getAllModerators: async () => {
      const response = await privateApi.get("/admin/moderators");
      return response.data;
    },
    createModerator: async (
      name: string,
      email: string,
      password: string,
      roles: string
    ) => {
      const response = await privateApi.post("/admin/create", {
        email,
        name,
        password,
        roles,
      });
      return response.data;
    },
    searchUsers: async (query: string) => {
      const response = await privateApi.get(`/search/users`, {
        params: { q: query },
      });
      return response.data;
    },
    searchPosts: async (query: string) => {
      const response = await privateApi.get(`/search/posts`, {
        params: { q: query },
      });
      return response.data;
    },
  },
};

export { publicApi, privateApi };
