import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bachelorette Party Scheduler",
  description: "Find the perfect dates for your bachelorette party!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
