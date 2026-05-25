import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERBOS Business Shell",
  description: "VERBOS internal ERP and CRM dashboard shell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
