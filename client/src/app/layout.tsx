import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_Mono } from "next/font/google";
import Header from "@/components/Header";

const mono = Noto_Sans_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Dashboard",
  description: "A Dashboard to view historic data from F1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.className} h-dvh bg-neutral-900 text-white`}>
        <div className="m-auto grid max-w-[1920px] grid-cols-[auto_1fr] gap-1 p-1 sm:gap-2 sm:p-2 md:gap-3 md:p-3 lg:p-4">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
