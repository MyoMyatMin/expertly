import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import theme from "./theme";
import Header from "@/components/Header";

export const metadata = {
  title: "Expertly",
  description: "This is a knowledge sharing platform shared by experts.",

  manifest: "/site.webmanifest",
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
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
