"use client";

import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <title>TikTok Favorites</title>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-[#15162c]">
          {children}
          <Analytics />
        </body>
      </html>
    </QueryClientProvider>
  );
}
