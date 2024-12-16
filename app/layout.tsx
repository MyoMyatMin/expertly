import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import theme from "./theme";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthProvider";

export const metadata = {
  title: "Expertly",
  description: "This is a knowledge sharing platform shared by experts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
