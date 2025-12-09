import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayana Expedition Assessment",
  description: "Coastal celebration expedition availability assessment for Dr. Ayana Elizabeth Johnson • March 6-22, 2026",
  openGraph: {
    title: "Ayana Expedition Assessment",
    description: "Coastal Celebration Expedition • March 6-22, 2026",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ayana Expedition Assessment",
    description: "Coastal Celebration Expedition • March 6-22, 2026",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>",
  },
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
