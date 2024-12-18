export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshResponse = await fetch("http://localhost:8000/refresh_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      throw new Error("Failed to refresh access token");
    }

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};
