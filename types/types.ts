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
  HasUpvoted?: boolean;
  HasSaved?: boolean;
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
  ReviewerName: string | null;
}

export interface ContributorApplication {
  ContriAppID: string;
  UserID: string;
  ExpertiseProofs: string[];
  IdentityProof: string;
  InitialSubmission: string;
  Status: { String: string; Valid: boolean };
  CreatedAt: { Time: string; Valid: boolean };
  ReviewedAt: { Time: string; Valid: boolean };
  ReviewerName: { String: string; Valid: boolean };
  Name: string;
  Username: string;
}

export interface Report {
  ReportID: string;
  ReportedBy: string;
  ReportedTargetPostID: string;
  TargetUserID: string;
  ReportedTargetCommentID: string | null;
  Reason: string;
  Status: {
    String: "pending" | "resolved" | "dismissed";
    Valid: boolean;
  };
  ReviewedAt: {
    Time: string;
    Valid: boolean;
  };
  ReviewedBy: string | null;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  ReportedByID: string;
  ReportedByName: {
    String: string;
    Valid: boolean;
  };
  ReportedByUsername: {
    String: string;
    Valid: boolean;
  };
  TargetUserID_2: string;
  TargetName: {
    String: string;
    Valid: boolean;
  };
  TargetUsername: {
    String: string;
    Valid: boolean;
  };
  PostID: string;
  TargetPostSlug: {
    String: string;
    Valid: boolean;
  };
  CommentID: string | null;
  TargetComment: {
    String: string;
    Valid: boolean;
  };
  ReviewerName: {
    String: string;
    Valid: boolean;
  };
}

export interface Appeals {
  AppealID: string;
  AppealedBy: string;
  TargetReportID: string;
  Reason: string;
  Status: {
    String: string;
    Valid: boolean;
  };
  ReviewedAt: {
    Time: string;
    Valid: boolean;
  };
  Reviewedby: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  AppealedByID: string;
  AppealedByName: {
    String: string;
    Valid: boolean;
  };
  AppealedByUsername: {
    String: string;
    Valid: boolean;
  };
  TargetReportID_2: string;
  TargetReportReason: {
    String: string;
    Valid: boolean;
  };
  TargetPostID: string;
  TargetUserID: string;
  TargetCommentID: string | null;
  ReviewerName: {
    String: string;
    Valid: boolean;
  };
}

export interface Appeal {
  AppealID: string;
  AppealedBy: string;
  TargetReportID: string;
  AppealReason: string;
  AppealStatus: {
    String: "pending" | "resolved" | "dismissed";
    Valid: boolean;
  };
  ReviewedAt: {
    Time: string;
    Valid: boolean;
  };
  Reviewedby: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  AppealedByID: string;
  AppealedByName: {
    String: string;
    Valid: boolean;
  };
  TargetReportID_2: string;
  TargetReportReason: {
    String: string;
    Valid: boolean;
  };
  TargetPostID: string;
  TargetUserID: string;
  TargetCommentID: string | null;
  CommentContent: {
    String: string;
    Valid: boolean;
  };
  PostSlug: {
    String: string;
    Valid: boolean;
  };
  TargetUserSuspendedUntil: {
    Time: string;
    Valid: boolean;
  };
  TargetUserName: {
    String: string;
    Valid: boolean;
  };
  TargetUserUsername: {
    String: string;
    Valid: boolean;
  };
  ReviewerName: {
    String: string;
    Valid: boolean;
  };
}
export interface CommentType {
  id: string;
  content: string;
  parent_comment_id: string | null;
  post_id: string;
  user_id: string;
  replies: CommentType[];
  username: string;
  name: string;
}

export interface SuspendedReport {
  ReportID: string; // UUID
  ReportedBy: string; // UUID
  TargetUserID: string; // UUID
  Reason: string;
  ReportStatus: {
    String: string; // e.g., "resolved"
    Valid: boolean;
  };
  ReviewedAt: {
    Time: string; // ISO datetime string
    Valid: boolean;
  };
  Reviewedby: string; // UUID
  CreatedAt: {
    Time: string; // ISO datetime string
    Valid: boolean;
  };
  SuspendDays: {
    Int32: number; // Number of days suspended
    Valid: boolean;
  };
  TargetUserID_2: string; // UUID (duplicate of TargetUserID)
  TargetName: {
    String: string; // Name of the target user
    Valid: boolean;
  };
  TargetUsername: {
    String: string; // Username of the target user
    Valid: boolean;
  };
  PostID: string | null; // UUID or null
  TargetPostSlug: {
    String: string; // Slug of the post
    Valid: boolean;
  };
  CommentID: string | null; // UUID or null
  TargetComment: {
    String: string; // Content of the comment
    Valid: boolean;
  };
  AppealID: string | null; // UUID or null
  AppealStatus: {
    String: string; // Status of the appeal (empty string if not applicable)
    Valid: boolean;
  };
  AppealCreatedAt: {
    Time: string; // ISO datetime string (default "0001-01-01T00:00:00Z" if not applicable)
    Valid: boolean;
  };
}
