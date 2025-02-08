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
}
