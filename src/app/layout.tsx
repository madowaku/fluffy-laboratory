import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluffy Laboratory / 未定形研究室",
  description:
    "研究になる前の問いを、ふわふわした仮説の綿毛として観察する小さな研究室。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
