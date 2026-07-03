import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lovely.my-girlfriend.app"),
  title: "胡鑫玥 💕 专属空间",
  description: "一个只属于你的浪漫角落，记录我们的每一个心动瞬间",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>",
  },
  openGraph: {
    title: "胡鑫玥 💕 专属空间",
    description: "一个只属于你的浪漫角落",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
