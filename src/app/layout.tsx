import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
