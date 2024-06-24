import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";

const mono = Noto_Sans_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Dashboard",
  description:
    "Explore F1 Dashboard, the web app for replaying Formula 1 telemetry data. Track driver positions, rankings, and track status through an interactive timeline.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://f1-dashboard.app"),
  alternates: {
    canonical: "./",
    languages: {
      en: "/en",
    },
  },
  openGraph: {
    title: "F1 Dashboard",
    description:
      "Analyze past sessions with detailed insights into race progress and performance. Enhance your Formula 1 experience today!",
    url: "https://f1-dashboard.app",
    siteName: "F1 Dashboard",
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        className={`${mono.className} mx-auto grid h-dvh max-w-[1920px] grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1 bg-neutral-900 p-1 text-white sm:gap-2 sm:p-2 md:gap-3 md:p-3 lg:p-4`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
