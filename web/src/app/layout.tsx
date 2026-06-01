import type { Metadata } from "next";
import { Providers } from "./providers";
import { AppBar } from "@/components/layout/AppBar";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "Knaq IoT Alert Triage",
  description: "IoT alert triage system for Knaq",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <AppBar />
          <Box component="main" sx={{ minHeight: "100vh" }}>
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
