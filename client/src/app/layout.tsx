import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_Mono, Noto_Sans } from "next/font/google";
import Header from "@/components/Header";
import ReactQueryProvider from "./utils/ReactQueryProvider";

const mono = Noto_Sans_Mono({ subsets: ["latin"] });
const sans = Noto_Sans({ weight: ["400", "700"], subsets: ["latin"] });

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
        <div className="m-auto grid max-w-[1920px] gap-x-2 gap-y-1 p-2 sm:gap-x-3  sm:gap-y-2 sm:p-3 md:gap-x-4 md:gap-y-3 md:p-4">
          <Header />
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
