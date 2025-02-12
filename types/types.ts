export interface User {
  user_id?: string;
  moderator_id?: string;
  username?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "contributor" | "moderator"; // Adjust roles if needed
  suspended_until: string; // Consider using Date instead of string if parsing
  followers?: number;
  following?: number;
  is_follwing?: boolean;
}

export interface Post {
  PostID: string;
  Slug: string;
  Title: string;
  UserID: string;
  Content: string;
  CreatedAt: Date;
  UpdatedAt?: Date;
  UpvoteCount?: number;
  CommentCount?: number;
  Upvotes?: number;
}

export interface Following {
  FollowingID: string;
  Name: string;
  Username: string;
}

export interface ContributorApplications {
  ContriAppID: string;
  UserID: string;
  Name: string;
  Status: "pending" | "approved" | "rejected";
  CreatedAt: string;
  ReviewedBy: string | null;
}

type ContributorApplication = {
  ContriAppID: string;
  UserID: string;
  ExpertiseProofs: string[];
  IdentityProof: string;
  InitialSubmission: string;
  Status: { String: string; Valid: boolean };
  CreatedAt: { Time: string; Valid: boolean };
  ReviewedAt: { Time: string; Valid: boolean };
  Name: string;
  Username: string;
};
