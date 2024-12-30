// app/hocs/withAuth.tsx

import { useAuth } from "@/contexts/AuthProvider"; // Adjust the import based on your context location
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// A Higher-Order Component (HOC) that wraps any component and handles authentication
const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If user is not authenticated, redirect to login page
      if (!user && !loading) {
        router.push("/auth/signin");
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Optionally show a loading state while checking authentication
    }

    if (!user) {
      return null; // Alternatively, you can show a blank screen or placeholder
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
